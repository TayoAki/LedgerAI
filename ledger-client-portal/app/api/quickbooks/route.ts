import {env} from 'cloudflare:workers';
import {account,db,json,error,sameOrigin,limitedBody,fail,quickbooksStatus} from '../../../lib/portal';

const api='https://backend.composio.dev/api/v3';
const config=()=>({key:(env as any).COMPOSIO_API_KEY as string|undefined,auth:(env as any).COMPOSIO_QUICKBOOKS_AUTH_CONFIG_ID as string|undefined});
const userId=(id:string)=>'ledger-client:'+id;
const view=(row:any,configured:boolean)=>({configured,status:!configured?'Unconfigured':row?.status||'Not connected',connected:configured&&row?.status==='ACTIVE',company_verified:false,company_verification_status:'Not verified',last_checked_at:row?.last_checked_at||null,expires_at:row?.expires_at||null});
async function call(path:string,key:string,body?:any){
 let response:Response;try{response=await fetch(api+path,{method:body?'POST':'GET',headers:{'x-api-key':key,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'manual',signal:AbortSignal.timeout(15000)});}catch{fail('The connection provider did not respond. Retry the status check before starting another connection.',502);}
 if(!response.ok)fail(response.status===401||response.status===403?'QuickBooks connection configuration needs the team’s attention.':'The connection provider could not complete this request.',502);
 const result=await response.json();if(!result||typeof result!=='object')fail('Invalid connection provider response.',502);return result as any;
}
export async function GET(req:Request){try{const state=await quickbooksStatus(await account(req));return json({...state,last_checked_at:state.checked_at});}catch(e){return error(e);}}
export async function POST(req:Request){try{
 sameOrigin(req);const a=await account(req),c=config(),j=JSON.parse(new TextDecoder().decode(await limitedBody(req,2000)));
 if(!['connect','status'].includes(j.action))fail('Unknown connection action');
 if(!c.key||!c.auth)return json({...view(null,false),message:'Your team must configure the QuickBooks connection before authorization is available.'});
 if(a.status!=='Active')fail('Your engagement must be accepted before connecting QuickBooks.',409);
 const saved=await db().prepare('SELECT * FROM portal_connections WHERE account_id=?').bind(a.id).first(),now=new Date().toISOString(),uid=userId(a.id);
 if(j.action==='status'){
  if(!saved?.connected_account_id)return json(view(saved,true));
  if(saved.user_id!==uid||saved.auth_config_id!==c.auth)fail('The saved connection does not match the current configuration.',409);
  const actual=await call('/connected_accounts/'+encodeURIComponent(saved.connected_account_id),c.key);
  const matches=actual.id===saved.connected_account_id&&actual.user_id===uid&&actual.auth_config?.id===c.auth&&actual.toolkit?.slug?.toLowerCase()==='quickbooks';
  const status=!matches?'Identity mismatch':actual.is_disabled||actual.auth_config?.is_disabled?'Disabled':typeof actual.status==='string'?actual.status:'Unknown';
  const result=await db().prepare('UPDATE portal_connections SET status=?,last_checked_at=?,updated_at=? WHERE account_id=? AND connected_account_id=? AND auth_config_id=?').bind(status,now,now,a.id,saved.connected_account_id,c.auth).run();if(!result.meta.changes)fail('The connection changed during this check. Refresh to continue.',409);
  const summary=await quickbooksStatus(a);return json({...summary,last_checked_at:now,message:status==='ACTIVE'?(summary.company_verified?'Authorization checked. Your Accounting Lead’s company confirmation is recorded; source readiness is reviewed separately.':'Authorization completed. Your team must still verify the QuickBooks company and source completeness.'):!matches?'The provider identity did not match this client. Contact your team.':'Connection status checked.'});
 }
 if(saved?.auth_config_id===c.auth&&saved.user_id===uid){
  if(saved.status==='ACTIVE'){const state=await quickbooksStatus(a);return json({...state,last_checked_at:state.checked_at});}
  if(['INITIALIZING','INITIATED'].includes(saved.status)&&Date.parse(saved.expires_at)>Date.now()&&saved.redirect_url)return json({...view(saved,true),redirect_url:saved.redirect_url});
  if(['Creating','Needs attention'].includes(saved.status)&&Date.parse(saved.created_at)>Date.now()-10*60*1000)fail('A connection is already being created. Check its status shortly.',409);
 }
 // Reserve this account before calling the provider; simultaneous browser tabs cannot create two flows.
 const reserve=saved?await db().prepare("UPDATE portal_connections SET user_id=?,auth_config_id=?,connected_account_id=NULL,status='Creating',redirect_url=NULL,expires_at=NULL,created_at=?,updated_at=?,last_checked_at=NULL WHERE account_id=? AND updated_at=? AND status=? AND created_at=?").bind(uid,c.auth,now,now,a.id,saved.updated_at,saved.status,saved.created_at).run():await db().prepare("INSERT OR IGNORE INTO portal_connections(account_id,user_id,auth_config_id,status,created_at,updated_at) VALUES(?,?,?,'Creating',?,?)").bind(a.id,uid,c.auth,now,now).run();
 if(!reserve.meta.changes)fail('Another connection request is in progress. Refresh to continue.',409);
 // Callback is only navigation. Completion is verified by authenticated POST status using the stored account ID.
 const callback=new URL('https://ledger-client-portal.kingkamina.chatgpt.site/');callback.searchParams.set('connection','return');
 let result:any;try{result=await call('/connected_accounts/link',c.key,{auth_config_id:c.auth,user_id:uid,callback_url:callback.toString()});}catch(e){await db().prepare("UPDATE portal_connections SET status='Needs attention',updated_at=? WHERE account_id=? AND status='Creating'").bind(new Date().toISOString(),a.id).run();throw e;}
 if(typeof result.connected_account_id!=='string'||!/^[a-zA-Z0-9_-]{1,200}$/.test(result.connected_account_id)||typeof result.redirect_url!=='string'||!/^https:\/\//.test(result.redirect_url)||!Number.isFinite(Date.parse(result.expires_at))||Date.parse(result.expires_at)<=Date.now())fail('The connection provider returned an incomplete authorization link.',502);
 const stored=await db().prepare("UPDATE portal_connections SET connected_account_id=?,status='INITIALIZING',redirect_url=?,expires_at=?,updated_at=? WHERE account_id=? AND status='Creating' AND created_at=?").bind(result.connected_account_id,result.redirect_url,result.expires_at,new Date().toISOString(),a.id,now).run();if(!stored.meta.changes)fail('The authorization flow changed. Check status before starting another connection.',409);
 return json({...view({status:'INITIALIZING',expires_at:result.expires_at},true),redirect_url:result.redirect_url});
 }catch(e){return error(e);}}
