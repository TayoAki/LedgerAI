import {limitedBody,bridgeAuth,db,bundle,bucket,json,error,text,fail,canonical,appendMessage} from '../../../lib/portal';

export async function GET(req:Request){try{await bridgeAuth(req);const params=new URL(req.url).searchParams,file=params.get('file');if(file){const f=await db().prepare("SELECT * FROM portal_files WHERE id=? AND state='Ready'").bind(file).first();if(!f)fail('Not found',404);const o=await bucket().get(f.account_id+'/'+f.id);if(!o)fail('Not found',404);return new Response(o.body,{headers:{'Content-Type':f.mime,'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(f.name),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}const offset=Math.max(0,Number(params.get('offset'))||0),rows=await db().prepare("SELECT * FROM portal_accounts WHERE status!='Draft' ORDER BY created_at,id LIMIT 100 OFFSET ?").bind(offset).all();return json({accounts:await Promise.all(rows.results.map(bundle)),next_offset:rows.results.length===100?offset+100:null});}catch(e){return error(e);}}

export async function POST(req:Request){try{
 await bridgeAuth(req);const j=JSON.parse(new TextDecoder().decode(await limitedBody(req,150000))),a=await db().prepare('SELECT * FROM portal_accounts WHERE id=?').bind(text(j.account_id)).first();if(!a)fail('Client portal account not found',404);const now=new Date().toISOString();
 if(j.action==='activate'){await db().prepare("UPDATE portal_accounts SET status='Active',updated_at=? WHERE id=?").bind(now,a.id).run();return json({ok:true});}
 if(j.action==='record_company_check'){
  const connectionId=text(j.connected_account_id,201),companyId=text(j.company_id,200),evidence=text(j.evidence,12000);
  if(!connectionId||connectionId.length>200||!companyId||!evidence||typeof j.checked_at!=='string'||!Number.isFinite(Date.parse(j.checked_at)))fail('Exact connection, company, inspection evidence and checked_at required.');
  const checkedAt=new Date(j.checked_at).toISOString();if(Date.parse(checkedAt)>Date.now()+60000)fail('Company inspection cannot be dated in the future.');
  const connection=await db().prepare("SELECT * FROM portal_connections WHERE account_id=? AND connected_account_id=? AND status='ACTIVE'").bind(a.id,connectionId).first();if(!connection)fail('Company inspection does not match the current ACTIVE connection.',409);
  const id='company-check:'+a.id,payload={connected_account_id:connectionId,company_id:companyId,evidence,checked_at:checkedAt,checked_by:'accounting_lead'},existing=await db().prepare('SELECT * FROM portal_items WHERE id=?').bind(id).first();
  if(existing){if(existing.account_id!==a.id||existing.kind!=='company_check')fail('Company inspection scope mismatch.',409);const old=JSON.parse(existing.payload);if(canonical(old)===canonical(payload))return json({id,stored_at:existing.updated_at,duplicate:true});if(Date.parse(old.checked_at)>=Date.parse(checkedAt))fail('An equal or newer company inspection is already recorded.',409);}
  const stored=existing?await db().prepare("UPDATE portal_items SET payload=?,updated_at=? WHERE id=? AND account_id=? AND payload=? AND EXISTS(SELECT 1 FROM portal_connections WHERE account_id=? AND connected_account_id=? AND status='ACTIVE')").bind(JSON.stringify(payload),now,id,a.id,existing.payload,a.id,connectionId).run():await db().prepare("INSERT OR IGNORE INTO portal_items(id,account_id,kind,payload,updated_at) SELECT ?,?,'company_check',?,? WHERE EXISTS(SELECT 1 FROM portal_connections WHERE account_id=? AND connected_account_id=? AND status='ACTIVE')").bind(id,a.id,JSON.stringify(payload),now,a.id,connectionId).run();if(!stored.meta.changes)fail('The connection or company inspection changed. Read it back before retrying.',409);
  return json({id,stored_at:now});
 }
 if(j.action==='append_message'||j.action==='put_message'){
  if(j.sender&&j.sender!=='team')fail('Bridge messages must be authored by the team.');
  const id=text(j.id,400),item=await db().prepare('SELECT * FROM portal_items WHERE id=? AND account_id=?').bind(text(j.item_id,400),a.id).first(),body=text(j.body,8000);if(!id||!item||!body)fail('Existing item, message ID and body required.');const saved=await appendMessage(a.id,item.id,'team',body,id);return json({id:saved.id,stored_at:saved.created_at});
 }
 if(j.action!=='put_item')fail('Unknown action');
 if(!['request','service_request','progress','engagement','report','note'].includes(j.kind))fail('Invalid item kind');
 const id=text(j.id,400);if(!id)fail('Stable item ID required');let payload=j.payload;if(!payload||typeof payload!=='object'||Array.isArray(payload))fail('Invalid payload');
 let existing=await db().prepare('SELECT * FROM portal_items WHERE id=?').bind(id).first();
 if(!existing&&j.kind==='service_request')fail('Client service request not found',404);
 if(!existing){await db().prepare('INSERT OR IGNORE INTO portal_items(id,account_id,kind,payload,updated_at) VALUES(?,?,?,?,?)').bind(id,a.id,j.kind,JSON.stringify(payload),now).run();existing=await db().prepare('SELECT * FROM portal_items WHERE id=?').bind(id).first();}
 if(existing.account_id!==a.id||existing.kind!==j.kind)fail('Item scope mismatch',409);
 const old=JSON.parse(existing.payload);
 if(['report','engagement','note'].includes(j.kind)){
  if(canonical(old)!==canonical(payload))fail('This item ID already contains a different immutable version.',409);
  return json({id,stored_at:existing.updated_at,duplicate:existing.updated_at!==now});
 }
 if(j.kind==='service_request'){
  if(payload.status&&!['Open','Queued','In progress','Blocked','Resolved'].includes(payload.status))fail('Invalid service request status');
  payload={...old,...(payload.status?{status:payload.status}:{}),...(typeof payload.answer==='string'?{answer:text(payload.answer,12000)}:{}),...(typeof payload.task_id==='string'?{task_id:text(payload.task_id,200)}:{})};
 }else if(j.kind==='request'){
  payload={...payload,...old,status:payload.status==='Resolved'?'Resolved':old.status||'Open'};
 }
 if(canonical(old)===canonical(payload))return json({id,stored_at:existing.updated_at,duplicate:true});
 const result=await db().prepare('UPDATE portal_items SET payload=?,updated_at=? WHERE id=? AND account_id=? AND payload=?').bind(JSON.stringify(payload),now,id,a.id,existing.payload).run();if(!result.meta.changes)fail('Item changed during this update. Read it back before retrying.',409);
 return json({id,stored_at:now});
 }catch(e){return error(e);}}
