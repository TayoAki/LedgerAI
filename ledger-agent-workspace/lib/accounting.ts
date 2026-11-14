import {env} from 'cloudflare:workers';
import {readState,writeAction} from './store';
import {assertClaim} from './workflow';
const endpoint='https://ledger-client-portal.kingkamina.chatgpt.site/api/accounting';
export async function accountingAction(a:any,human:string|false=false){
 const s=await readState(),e=s.engagements.find((e:any)=>e.client_id===a.client_id&&e.active&&e.periods[a.accounting_period]);if(!e)throw Error('Accepted client and active accounting month required');
 if(!['document_coordinator','accounting_lead','production','quality_reviewer'].includes(a.role))throw Error('An accounting workflow role is required');
 if(!human){const work=a.inbox_id?s.inbox.find((i:any)=>i.id===a.inbox_id):s.tasks.find((t:any)=>t.id===a.task_id);if(!work)throw Error('Reference the scoped work being performed');if(work.client_id!==a.client_id||work.accounting_period!==a.accounting_period)throw Error('Work scope mismatch');if(work.owner===a.role)assertClaim(work,a,false);else if(!['quality_reviewer','accounting_lead'].includes(a.role)||!s.deliverables.some((d:any)=>d.task_id===work.id))throw Error('Independent read requires an existing scoped packet');}
 const secret=(env as any).PORTAL_BRIDGE_SECRET;if(!secret)throw Error('Portal bridge unavailable');
 const schema=a.action==='accounting_schema',company=a.tool_slug==='QUICKBOOKS_GET_COMPANY_INFO';
 // Report reads stay blocked until Accounting Lead inspects a real company-info result.
 const confirmed=Object.values(e.company_checks||{}).filter((c:any)=>c.company_id===e.company_id) as any[];
 if(!schema&&!company&&!confirmed.length)throw Error('Accounting Lead must confirm the observed company identity before reports are read');
 const r=await fetch(endpoint,{method:'POST',headers:{Authorization:'Bearer '+secret,'Content-Type':'application/json'},body:JSON.stringify({action:schema?'tool_schema':'read',account_id:e.intake_id,period:a.accounting_period,tool_slug:a.tool_slug,arguments:a.arguments,expected_connected_account_ids:!schema&&!company?confirmed.map((c:any)=>c.connected_account_id):undefined}),redirect:'manual'});
 const response:any=await r.json();if(!r.ok)throw Error(response.error||'Accounting read unavailable ('+r.status+')');
 if(schema)return response;if(!company&&response.connected_account_id&&!confirmed.some((c:any)=>c.connected_account_id===response.connected_account_id))throw Error('Report came from an unconfirmed connection');if(!response.successful)return {...response,notice:'Provider execution failed; no verified source or connection is recorded.'};
 if(response.result?.data===undefined||response.result?.data===null)throw Error('Provider returned no original report data.');const body=JSON.stringify(response.result);if(new TextEncoder().encode(body).length>400000)throw Error('Provider returned an oversized report. Obtain the original export through the portal; this response has not been recorded as a complete source.');
 const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(response.result.data))))).map(v=>v.toString(16).padStart(2,'0')).join('');
 const id='read:'+e.client_id+':'+a.accounting_period+':'+a.tool_slug+':'+response.connected_account_id+':'+sha256;await writeAction({action:'_record_accounting_read',record:{id,client_id:e.client_id,accounting_period:a.accounting_period,tool_slug:a.tool_slug,version:response.version,connected_account_id:response.connected_account_id,body:response.result,arguments:response.arguments||a.arguments,sha256,observed_at:response.observed_at,connection_checked_at:response.connection_checked_at,log_id:response.result.log_id||'',reader:a.role,run_id:a.run_id||'owner',successful:true}},false,true);
 return {...response,accounting_read_id:id,sha256,notice:company?'Original company response recorded. Accounting Lead must inspect and confirm identity; OAuth alone is not company verification.':'Original read response recorded. Document Coordinator must inspect it before verifying a source requirement. Source completeness remains unknown.'};
}
