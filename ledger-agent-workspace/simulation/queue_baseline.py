import json, copy
from collections import defaultdict, Counter
from pathlib import Path
BASE=Path('simulation')
clients=[]
for i in range(1,101):
 kind='Routine' if i<=60 else 'Complex' if i<=80 else 'New onboarding'
 reason='';ready=1
 if i<=12:reason='Missing bank statement';ready=4 if i<=8 else 11
 elif 61<=i<=66:reason='Broken accountant access';ready=3 if i<=64 else 11
 elif 81<=i<=84:reason='Unresolved opening balance';ready=6 if i<=82 else 11
 clients.append(dict(id=f'SIM-{i:03}',kind=kind,ready_day=ready,initial_blocker=reason,rework=i%4==0,retention_risk=i in range(51,61),payroll_requested=i in range(69,81),due_day=10))
TIMES={'Routine':{'prep':40,'review':15,'approval':8,'correction':20},'Complex':{'prep':100,'review':35,'approval':12,'correction':35},'New onboarding':{'prep':80,'review':25,'approval':12,'correction':30}}
SCENARIOS={
 'A · One production lane':{'production':(1,300),'accounting_lead':(1,180),'client_success':(1,180),'human_approver':(1,60)},
 'B · More production only':{'production':(2,300),'accounting_lead':(1,180),'client_success':(1,180),'human_approver':(1,60)},
 'C · Balanced review and approval':{'production':(2,300),'accounting_lead':(1,300),'client_success':(1,240),'human_approver':(1,120)},
}
ROLES=['client_success','production','accounting_lead','human_approver']
def run(name,config):
 records=copy.deepcopy(clients);byid={c['id']:c for c in records};queues={r:[] for r in ROLES};workers={r:[None]*config[r][0] for r in ROLES};spent=Counter();history=[];tasklog=[];retention_done=0
 def put(c,step,role,minutes,now,due=10):
  j={'client':c['id'],'step':step,'role':role,'minutes':minutes,'remaining':minutes,'queued':now,'due':due};queues[role].append(j)
  if step!='retention':c['state']=step;c['next_owner']=role
 def next_step(job,now):
  nonlocal retention_done
  c=byid[job['client']];step=job['step'];t=TIMES[c['kind']]
  tasklog.append({'scenario':name,'client':c['id'],'role':job['role'],'step':step,'queued_day':job['queued']//480+1,'started_day':job['started']//480+1,'completed_day':now//480+1,'wait_minutes':job['started']-job['queued'],'work_minutes':job['minutes']})
  if step=='intake':put(c,'readiness','accounting_lead',30,now)
  elif step=='readiness':put(c,'prepare','production',t['prep'],now)
  elif step=='prepare':put(c,'review','accounting_lead',t['review'],now)
  elif step=='review' and c['rework']:put(c,'correct','production',t['correction'],now)
  elif step in ('review','recheck'):put(c,'approve','human_approver',t['approval'],now)
  elif step=='correct':put(c,'recheck','accounting_lead',10,now)
  elif step=='approve':put(c,'deliver','client_success',10,now)
  elif step=='deliver':c.update(state='Delivered',next_owner='',delivered_day=now//480+1)
  elif step=='retention':retention_done+=1
 for c in records:c.update(state='Waiting for inputs',next_owner='client_success',delivered_day=None)
 for day in range(1,11):
  used={r:[0]*config[r][0] for r in ROLES}
  for c in records:
   if c['ready_day']==day:
    if c['kind']=='New onboarding':put(c,'intake','client_success',60,(day-1)*480)
    else:put(c,'prepare','production',TIMES[c['kind']]['prep'],(day-1)*480)
   if c['retention_risk'] and day==3:put(c,'retention','client_success',30,(day-1)*480,due=5)
  for minute in range(480):
   now=(day-1)*480+minute;finished=[]
   for role in ROLES:
    for w in range(config[role][0]):
     if used[role][w]>=config[role][1]:continue
     if workers[role][w] is None and queues[role]:
      queues[role].sort(key=lambda j:(j['due'],j['queued'],j['client']))
      job=queues[role].pop(0);job['started']=now;workers[role][w]=job
     job=workers[role][w]
     if job:
      job['remaining']-=1;used[role][w]+=1;spent[role]+=1
      if job['remaining']==0:finished.append(job);workers[role][w]=None
   for job in finished:next_step(job,now)
  stat=Counter(c['state'] for c in records)
  history.append({'scenario':name,'day':day,'delivered':stat['Delivered'],'input_blocked':stat['Waiting for inputs'],'production_queue':sum(stat[x] for x in ['prepare','correct']),'lead_queue':sum(stat[x] for x in ['readiness','review','recheck']),'approval_queue':stat['approve'],'coordinator_queue':sum(stat[x] for x in ['intake','deliver']),'retention_completed':retention_done})
 summary=dict(name=name,delivered=sum(c['state']=='Delivered' for c in records),input_blocked=sum(c['state']=='Waiting for inputs' for c in records),capacity_backlog=sum(c['state'] not in ['Delivered','Waiting for inputs'] for c in records),retention_actions_completed=retention_done,role_work_minutes=dict(spent),role_budget_minutes={r:config[r][0]*config[r][1]*10 for r in ROLES},state_counts=dict(Counter(c['state'] for c in records)))
 return {'summary':summary,'daily':history,'clients':records,'tasklog':tasklog}
results={name:run(name,config) for name,config in SCENARIOS.items()}
out={'method':'Deterministic discrete-event planning model, 10 weekdays × 480 work minutes. Role budgets are explicit illustrative assumptions, not observed AI speeds or staffing benchmarks. Setup gates and technical defects are assumed fixed for these conditional scenarios. Every client must reach delivery after review and human approval. Task durations are synthetic. Work beyond the daily budget resumes next day.','clients':clients,'work_minutes':TIMES,'capacities':SCENARIOS,'results':results}
(BASE/'queue_results.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v['summary'] for k,v in results.items()},indent=2))
