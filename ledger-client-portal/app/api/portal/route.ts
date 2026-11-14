import {limitedBody,identity,account,bundle,db,json,error,sameOrigin,text,period,fail,canonical,stableKey,appendMessage} from '../../../lib/portal';

export async function GET(req:Request){try{const u=identity(req);const a=await db().prepare('SELECT * FROM portal_accounts WHERE user_id=?').bind(u.id).first();return json({user:{email:u.email},account:a?await bundle(a):null});}catch(e){return error(e);}}

export async function POST(req:Request){try{
 sameOrigin(req);const u=identity(req);
 const j=JSON.parse(new TextDecoder().decode(await limitedBody(req,30000))),now=new Date().toISOString();
 if(j.action==='save_profile'||j.action==='submit'){
  const p:any={};for(const key of ['business','contact','phone','industry','country','entity','software','monthly_transactions','start_period','needs'])p[key]=text(j.profile?.[key],key==='needs'?2500:200);
  if(!p.business||!p.contact)fail('Business and contact name are required.');
  const previous=await db().prepare('SELECT * FROM portal_accounts WHERE user_id=?').bind(u.id).first(),old=JSON.parse(previous?.profile||'{}');
  if(previous?.status==='Active'){
   for(const key of ['business','contact','industry','country','entity','software','monthly_transactions','start_period','needs'])if((p[key]||'')!==(old[key]||''))fail('Your accepted business details are locked. Send a service request to ask for a change.',409);
  }
  if(j.action==='submit'&&previous?.status!=='Active'){if(!j.consent)fail('Confirm that you are authorized to share these details.');period(p.start_period);if(!p.country||!p.software)fail('Complete country and bookkeeping software.');}
  const status=previous?.status==='Active'?'Active':j.action==='submit'?'Submitted':previous?.status||'Draft';
  const savedProfile=JSON.stringify({...p,consented_at:old.consented_at||(j.consent?now:null)});
  // A stale profile update must not overwrite a concurrently accepted engagement.
  if(previous){const result=await db().prepare('UPDATE portal_accounts SET profile=?,status=?,updated_at=?,email=? WHERE id=? AND status=? AND profile=?').bind(savedProfile,status,now,previous.status==='Active'?previous.email:u.email,previous.id,previous.status,previous.profile).run();if(!result.meta.changes)fail('Your profile changed. Refresh before saving again.',409);}
  else {const result=await db().prepare('INSERT OR IGNORE INTO portal_accounts(id,user_id,email,profile,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),u.id,u.email,savedProfile,status,now,now).run();if(!result.meta.changes)fail('Your profile was saved in another window. Refresh to continue.',409);}
 }else if(j.action==='service_request'){
  const a=await account(req);if(a.status!=='Active')fail('Service requests become available after your engagement is accepted.',409);
  const key=stableKey(j.idempotency_key),id='service:'+a.id+':'+key;
  const payload={period:period(j.period),category:text(j.category,100),title:text(j.title,200),body:text(j.body,8000),idempotency_key:key};
  if(!payload.category||!payload.title||!payload.body)fail('Add a category, title and request details.');
  await db().prepare('INSERT OR IGNORE INTO portal_items(id,account_id,kind,payload,updated_at) VALUES(?,?,?,?,?)').bind(id,a.id,'service_request',JSON.stringify({...payload,status:'Open',created_at:now}),now).run();
  const item=await db().prepare('SELECT * FROM portal_items WHERE id=?').bind(id).first(),saved=JSON.parse(item.payload);
  if(item.account_id!==a.id||item.kind!=='service_request'||Object.keys(payload).some(k=>canonical(saved[k])!==canonical((payload as any)[k])))fail('This request key was already used for different details.',409);
 }else if(j.action==='reply'){
  const a=await account(req),item=await db().prepare("SELECT * FROM portal_items WHERE id=? AND account_id=? AND kind IN ('request','service_request')").bind(text(j.id,400),a.id).first();
  if(!item)fail('Request not found',404);const reply=text(j.reply,4000);if(!reply)fail('Write a reply.');if(JSON.parse(item.payload).status==='Resolved')fail('This request has been resolved.');
  const key=j.idempotency_key?stableKey(j.idempotency_key):crypto.randomUUID();
  await appendMessage(a.id,item.id,'client',reply,'client-message:'+a.id+':'+key);
 }else fail('Unknown action');
 return GET(req);
 }catch(e){return error(e);}}
