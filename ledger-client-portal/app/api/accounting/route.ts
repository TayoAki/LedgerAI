import {env} from 'cloudflare:workers';
import {bridgeAuth,db,error,fail,json,limitedBody,period,text} from '../../../lib/portal';
import {validateToolArguments} from '../../../lib/accounting-schema';

const api='https://backend.composio.dev/api/v3',version='20261101_00';
const permitted=new Set(['QUICKBOOKS_GET_COMPANY_INFO','QUICKBOOKS_GET_BALANCE_SHEET_REPORT','QUICKBOOKS_GET_GENERAL_LEDGER_REPORT','QUICKBOOKS_GET_PROFIT_AND_LOSS_REPORT','QUICKBOOKS_GET_REPORT_TRIAL_BALANCE','QUICKBOOKS_GET_TRANSACTION_LIST_REPORT']);
async function provider(path:string,key:string,body?:any){
 let response:Response;try{response=await fetch(api+path,{method:body?'POST':'GET',headers:{'x-api-key':key,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'manual',signal:AbortSignal.timeout(15000)});}catch{fail('The accounting connection did not respond.',502);}
 if(!response.ok)fail('The accounting provider rejected this read. Check connection configuration and status.',502);
 return await response.json() as any;
}
export async function POST(req:Request){try{
 await bridgeAuth(req);const j=JSON.parse(new TextDecoder().decode(await limitedBody(req,30000)));
 if(!['tool_schema','read'].includes(j.action))fail('Only schema and read actions are supported.');
 const tool=j.tool_slug;if(!permitted.has(tool))fail('This accounting tool is not permitted.',403);
 const month=period(j.period),a=await db().prepare("SELECT * FROM portal_accounts WHERE id=? AND status='Active'").bind(text(j.account_id)).first();if(!a)fail('Active client portal account not found.',404);
 const key=(env as any).COMPOSIO_API_KEY,auth=(env as any).COMPOSIO_QUICKBOOKS_AUTH_CONFIG_ID;if(!key||!auth)fail('QuickBooks connection is not configured.',503);
 const connection=await db().prepare('SELECT * FROM portal_connections WHERE account_id=?').bind(a.id).first(),uid='ledger-client:'+a.id;
 if(!connection?.connected_account_id||connection.user_id!==uid||connection.auth_config_id!==auth)fail('A matching per-client QuickBooks connection is required.',409);
 if(j.action==='read'&&tool!=='QUICKBOOKS_GET_COMPANY_INFO'){
  const expected=j.expected_connected_account_ids;
  if(!Array.isArray(expected)||!expected.length||expected.length>10||expected.some(id=>typeof id!=='string'||!id||id.length>200)||!expected.includes(connection.connected_account_id))fail('This connection has not been independently confirmed for the client. Inspect the company again after reconnecting.',409);
 }
 const actual=await provider('/connected_accounts/'+encodeURIComponent(connection.connected_account_id),key),checkedAt=new Date().toISOString();
 const matches=actual?.id===connection.connected_account_id&&actual?.user_id===uid&&actual?.auth_config?.id===auth&&actual?.toolkit?.slug?.toLowerCase()==='quickbooks';
 const status=!matches?'Identity mismatch':actual.is_disabled||actual.auth_config?.is_disabled?'Disabled':actual.status;
 await db().prepare('UPDATE portal_connections SET status=?,last_checked_at=?,updated_at=? WHERE account_id=? AND connected_account_id=? AND auth_config_id=?').bind(typeof status==='string'?status:'Unknown',checkedAt,checkedAt,a.id,connection.connected_account_id,auth).run();
 if(status!=='ACTIVE')fail('The exact client connection must be ACTIVE and enabled before this read.',409);
 const schema=await provider('/tools/'+tool+'?version='+version,key);
 if(schema?.slug!==tool||schema?.version!==version||schema?.toolkit?.slug?.toLowerCase()!=='quickbooks'||!schema.input_parameters)fail('The provider returned an unexpected tool schema or version.',502);
 const scope={account_id:a.id,accounting_period:month,tool_slug:tool,version,connection_checked_at:checkedAt,company_verified:false};
 if(j.action==='tool_schema')return json({...scope,schema,observed_at:new Date().toISOString()});
 if(!j.arguments||typeof j.arguments!=='object'||Array.isArray(j.arguments))fail('Structured arguments must be an object.');
 let argumentsValue={...j.arguments};
 if(tool!=='QUICKBOOKS_GET_COMPANY_INFO'){
  const properties=schema.input_parameters.properties||schema.input_parameters;
  if(!Object.hasOwn(properties,'start_date')||!Object.hasOwn(properties,'end_date'))fail('This report schema does not declare start_date and end_date. Exact-month execution is unsupported; no date aliases will be guessed.',409);
  if(Object.hasOwn(argumentsValue,'date_macro'))fail('Report date_macro is not permitted; use the exact accounting month.',409);
  if(properties.date_macro?.default)fail('This report schema supplies a default date_macro. Exact-month execution needs a reviewed adapter.',409);
  const start=month+'-01',last=new Date(start+'T00:00:00Z');last.setUTCMonth(last.getUTCMonth()+1);last.setUTCDate(0);const end=last.toISOString().slice(0,10);
  if(Object.hasOwn(argumentsValue,'start_date')&&argumentsValue.start_date!==start||Object.hasOwn(argumentsValue,'end_date')&&argumentsValue.end_date!==end)fail('Report dates must match the exact requested accounting month.',409);
  argumentsValue={...argumentsValue,start_date:start,end_date:end};
 }
 validateToolArguments(schema.input_parameters,argumentsValue);
 // Browser/user-supplied account IDs, custom auth and versions are never passed to the provider.
 const result=await provider('/tools/execute/'+tool,key,{connected_account_id:connection.connected_account_id,user_id:uid,version,arguments:argumentsValue});
 return json({...scope,arguments:argumentsValue,connected_account_id:connection.connected_account_id,result,successful:result?.successful===true,observed_at:new Date().toISOString()});
 }catch(e){return error(e);}}
