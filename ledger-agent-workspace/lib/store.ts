import { env } from 'cloudflare:workers';
import { initialState, normalize, applyAction, collections } from './model';
export async function readState(){
 if(!env.DB)throw Error('Workspace database is unavailable.');
 const results:any=await env.DB.batch([env.DB.prepare('SELECT * FROM workspace_meta WHERE id = ?').bind('main'),env.DB.prepare('SELECT kind,payload FROM workspace_records ORDER BY rowid')]);
 const meta=results[0].results[0];if(!meta){const legacy:any=await env.DB.prepare('SELECT payload FROM workspace WHERE id = ?').bind('main').first();return {...normalize(legacy?JSON.parse(legacy.payload):initialState()),version:0};}
 const s:any={...JSON.parse(meta.payload),version:meta.revision};for(const k of collections)s[k]=[];for(const row of results[1].results)s[row.kind]?.push(JSON.parse(row.payload));
 for(const k of ['tasks','documents','deliverables','handoffs','reports','runs','activity'])s[k].sort((a:any,b:any)=>(b.created_at||b.at||'').localeCompare(a.created_at||a.at||''));return normalize(s);
}
function records(s:any){const rows=new Map<string,{kind:string,payload:string}>();for(const k of collections)for(const r of s[k])rows.set(k+':'+(r.id||r.run_id),{kind:k,payload:JSON.stringify(r)});return rows;}
export async function writeAction(action:any,human:boolean|string=false,trusted=false){
 if(!env.DB)throw Error('Workspace database is unavailable.');
 for(let retry=0;retry<3;retry++){
  const s=await readState(),v=s.version,next=applyAction(structuredClone(s),action,human,trusted);const token=crypto.randomUUID();next.version=v+1;
  const meta={...next};for(const k of collections)delete meta[k];const before=v?records(s):new Map(),after=records(next);
  const q=[v===0?env.DB.prepare('INSERT OR IGNORE INTO workspace_meta(id,revision,token,payload) VALUES (?,?,?,?)').bind('main',1,token,JSON.stringify(meta)):env.DB.prepare('UPDATE workspace_meta SET revision=?,token=?,payload=? WHERE id=? AND revision=?').bind(v+1,token,JSON.stringify(meta),'main',v)];
  for(const [key,row] of after){if(before.get(key)?.payload===row.payload)continue;if(new TextEncoder().encode(row.payload).length>500000)throw Error('Record is too large. Store its evidence externally.');q.push(env.DB.prepare('INSERT INTO workspace_records(key,kind,payload) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM workspace_meta WHERE id=? AND token=?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload').bind(key,row.kind,row.payload,'main',token));}
  const result=await env.DB.batch(q);if(result[0].meta.changes)return next;
 }
 throw Error('Workspace changed concurrently. Refresh and try again.');
}
