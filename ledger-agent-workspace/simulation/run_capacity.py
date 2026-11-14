from pathlib import Path
import json
src=Path('simulation/queue_baseline.py').read_text()
src=src[:src.index('results={name:')]
src=src.replace("ROLES=['client_success','production','accounting_lead','human_approver']","ROLES=['client_success','production','accounting_lead','human_approver','document_coordinator','quality_reviewer']")
src=src.replace("def run(name,config):", "def run(name,config):\n specialist='quality_reviewer' in config\n config={r:config.get(r,(0,0)) for r in ROLES}\n review_role='quality_reviewer' if specialist else 'accounting_lead'\n intake_role='document_coordinator' if specialist else 'client_success'")
src=src.replace("put(c,'review','accounting_lead'","put(c,'review',review_role").replace("put(c,'recheck','accounting_lead'","put(c,'recheck',review_role").replace("put(c,'intake','client_success'","put(c,'intake',intake_role")
exec(src)
SCENARIOS['D · Specialists, same total budget as C']={'production':(2,300),'accounting_lead':(1,60),'quality_reviewer':(1,240),'document_coordinator':(1,120),'client_success':(1,120),'human_approver':(1,120)}
SCENARIOS['E · Specialists with additional capacity']={'production':(2,360),'accounting_lead':(1,120),'quality_reviewer':(1,240),'document_coordinator':(1,180),'client_success':(1,180),'human_approver':(1,120)}
results={name:run(name,cfg) for name,cfg in SCENARIOS.items()}
for name,r in results.items():
 z=r['summary'];assert z['delivered']+z['input_blocked']+z['capacity_backlog']==100
 for role,used in z['role_work_minutes'].items():assert used<=z['role_budget_minutes'][role]
 for c in r['clients']:
  if c['state']=='Delivered':
   steps=[x['step'] for x in r['tasklog'] if x['client']==c['id'] and x['step']!='retention']
   expected=(['intake','readiness'] if c['kind']=='New onboarding' else [])+['prepare','review']+(['correct','recheck'] if c['rework'] else [])+['approve','deliver']
   assert steps==expected,(c['id'],steps)
base=json.loads(Path('simulation/baseline_queues.json').read_text())
for k in base['results']:
 current=results[k]['summary'].copy();current['role_budget_minutes']={r:n for r,n in current['role_budget_minutes'].items() if n};assert current==base['results'][k]['summary']
out={'method':'Isolated deterministic planning simulation. Same 100 fictional clients, 10 weekdays, durations, input release dates, rework cases and dependency gates as baseline. D reallocates C capacity; E adds 300 work minutes/day vs C (23.8%). Minutes are illustrative human-equivalent planning budgets, not observed agent speed. UI fixes alone do not increase capacity.','clients':clients,'work_minutes':TIMES,'capacities':SCENARIOS,'results':results}
Path('simulation/queue_results.json').write_text(json.dumps(out,indent=2))
print(json.dumps({k:{x:v['summary'][x] for x in ['delivered','input_blocked','capacity_backlog','role_work_minutes','role_budget_minutes']} for k,v in results.items()},indent=2))
