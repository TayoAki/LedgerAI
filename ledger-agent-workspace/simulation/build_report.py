from pathlib import Path
import json
from openpyxl import Workbook,load_workbook
from openpyxl.styles import Font,PatternFill,Alignment
from openpyxl.utils import get_column_letter
base=Path('simulation');q=json.loads((base/'queue_results.json').read_text());c=json.loads((base/'check_results.json').read_text());d=json.loads((base/'storage_results.json').read_text());old=json.loads((base/'baseline_checks.json').read_text())
w=Workbook();w.remove(w.active)
def sheet(name,headers,rows,widths=None):
 s=w.create_sheet(name);s.append(headers)
 for row in rows:s.append([json.dumps(v) if isinstance(v,(dict,list)) else v for v in row])
 s.freeze_panes='A2';s.auto_filter.ref=s.dimensions;s.row_dimensions[1].height=30
 for cell in s[1]:cell.fill=PatternFill('solid',fgColor='345A43');cell.font=Font(color='FFFFFF',bold=True);cell.alignment=Alignment(vertical='center',wrap_text=True)
 for row in s.iter_rows(min_row=2):
  for cell in row:cell.font=Font(name='Calibri',size=11,color='263D30');cell.alignment=Alignment(vertical='top',wrap_text=True)
  if row[0].row%2==0:
   for cell in row:cell.fill=PatternFill('solid',fgColor='F0F5EE')
 for i in range(1,len(headers)+1):s.column_dimensions[get_column_letter(i)].width=(widths[i-1] if widths else 25)
 return s
sheet('Read me',['Item','Finding'],[
 ['Scope','100 fictional clients, ten working days. Isolated workflow tests and capacity planning simulation. No real accounting, client messages or financial release occurred.'],
 ['UI','Published improvements: client/month portfolio, document inbox, independent review and human-release queues, exact-version handoffs, required delivery receipts, workload claims, honest connection readiness, daily evidence/blocker reports and Simulation tab.'],
 ['Agents added','Document Coordinator and Quality Reviewer. Eight enabled roles; payroll remains disabled. Existing six core roles retained.'],
 ['Baseline workflow checks','12 of 23 passed; 11 gaps. Rerun: all 23 equivalent checks pass, plus 17 new workflow checks (40 total). Seven SQLite storage checks pass.'],
 ['Capacity result','Original one-production-lane case: 42 delivered, 8 input blocked, 50 queued. Previously balanced case C: 89 delivered, 8 blocked, 3 queued. Specialists with same total budget D: 89 / 8 / 3. Increased-capacity case E: 92 / 8 / 0.'],
 ['Attribution','The UI fixes do not by themselves cause the throughput increase. E uses 1,560 assumed work minutes/day vs 1,260 for C/D (+23.8%). These are planning budgets, not measured AI speeds or a staffing recommendation.'],
 ['Still blocked','Four missing statements, two broken-accountant-access cases, two opening-balance decisions remain unresolved by day 10.'],
 ['Validation limit','Browser visual QA unavailable because preview relay is unavailable. Local type/build/model/storage validation is performed separately. No real client integrations validated.'],
 ['Tool readiness','QuickBooks, Gmail, calendar, document portal and CRM/analytics remain unverified until an observed scoped check. Specialist skills do not grant access.'],
 ['Role authority','Roles are workflow identities under one trusted workspace service, not independent connector accounts or a per-role security sandbox. Human release cannot be performed through service actions.'],
 ['Storage','Record-level SQL storage, transactional concurrency protection and legacy-data preservation verified with SQLite adapter. Full-workspace API reads still need pagination before substantially larger, multi-year workloads.'],
 ['Reproducibility','Same client cohort, release dates, rework rules, task times and due-date queue priorities as prior model. Source tests and fixtures included in site source.']],[28,115])
rows=[]
for name,r in q['results'].items():
 z=r['summary'];rows.append([name,z['delivered'],z['input_blocked'],z['capacity_backlog'],sum(z['role_budget_minutes'].values())//10,z['retention_actions_completed']])
sheet('Scenario comparison',['Scenario','Delivered','Input blocked','Capacity backlog','Budget minutes/day','Retention actions done'],rows,[48,18,18,20,24,25])
rows=[]
for name,r in q['results'].items():
 for role,budget in r['summary']['role_budget_minutes'].items():
  if budget:rows.append([name,role,budget//10,budget,r['summary']['role_work_minutes'].get(role,0)])
sheet('Work budgets',['Scenario','Role','Daily budget minutes','10-day budget','Actual modeled work'],rows,[48,25,24,24,25])
e=q['results'][list(q['results'])[-1]]
sheet('100 clients',['Client','Type','Initial blocker','Inputs ready day','Rework','Due day','Final state','Delivered day','Next owner'],[[x[k] for k in ['id','kind','initial_blocker','ready_day','rework','due_day','state','delivered_day','next_owner']] for x in e['clients']],[17,24,37,20,15,15,24,20,25])
sheet('Daily queues',['Scenario','Day','Delivered','Input blocked','Production queue','Review and lead queue','Human approvals','Intake and delivery queue','Retention done'],[[row[k] for k in ['scenario','day','delivered','input_blocked','production_queue','lead_queue','approval_queue','coordinator_queue','retention_completed']] for r in q['results'].values() for row in r['daily']],[48,12,15,18,22,25,20,28,18])
sheet('Workflow checks',['Check','Passed','Observed'],[[x['name'],x['pass'],x['observed']] for x in c['tests']],[75,15,60])
sheet('Storage checks',['Check','Passed'],[[x['name'],x['pass']] for x in d['checks']],[90,18])
sheet('100 full journeys',['Client','State','Technical review','Simulated human approval','Version','Handoff','Delivery receipt'],[[x[k] for k in ['client','status','technical','human_approval','version','handoff','delivery']] for x in c['journeys']],[18,18,23,29,15,22,23])
sheet('Agent readiness',['Agent','Duty / deliverable','Needed tools','Actual readiness / handoff'],[
 ['Operations','Priorities, claims, run tracking, daily reports and LAPS','Ledger, scheduler, source event access','Workspace usable; source coverage remains unknown'],
 ['Marketing','Campaign drafts and qualified lead evidence','Gmail, CMS, analytics, documents','External access unverified; Sales accepts evidenced leads'],
 ['Sales','Discovery, scoped proposal, signed engagement handoff','Gmail, calendar, CRM, e-signature','External access unverified; no invented sales'],
 ['Document Coordinator (new)','Client/month source coverage manifest and missing-input queue','Client-scoped document portal, Gmail, client register','Installed; source access unverified. Production receives exact manifest'],
 ['Production','Reconciliations and versioned close packets','QuickBooks, original statements, calculation tools','External access unverified; Quality Reviewer checks packet'],
 ['Quality Reviewer (new)','Independent findings, correction recheck, technical pass','Read-only QuickBooks, originals, workpapers, review queue','Installed; source access unverified; human release still required'],
 ['Accounting Lead','Readiness, accounting judgments, scope and release recommendation','QuickBooks, workpapers, human decision route','External access unverified; accountable human owner reviews'],
 ['Client Success','Authorized delivery receipt, retention follow-up','Gmail, calendar, client portal','External access unverified; no sending assumed'],
 ['Payroll','Disabled until separately scoped and configured','Payroll provider, time tracking, human approval','Disabled; 12 requests in simulation remain outside core-close scope']],[30,64,55,80])
sheet('Assumptions',['Parameter','Value'],[['Method',q['method']],['Cohort','60 routine, 20 complex, 20 onboarding'],['Initial blockers','22; 14 clear by day 10, 8 remain'],['Rework','Every fourth client requires correction and recheck'],['Human approval','Every delivered close requires a modeled human approval job'],['Workflow correctness','100 complete journeys test controls with synthetic evidence; not a claim of accurate financial statements'],['Capacity durations',q['work_minutes']],['Input releases','SIM001–008 day4; 009–012 day11; 061–064 day3; 065–066 day11; 081–082 day6; 083–084 day11; others day1'],['Source model SHA256',c['source_sha256']],['Run time UTC',c['at']],['Combined load fixture',c['load']],['SQL record counts',d['counts']]],[33,115])
sheet('Specialist case trials',['Agent','Case','Observed outcome'],[
 ['Document Coordinator','Acorn client received a statement whose header belongs to Birch; missing card statement; no Gmail access','Rejected wrong-company source, left both sources missing, prepared scoped manifest and unsent request, routed blocker. Did not claim physical quarantine, delivery or live writes.'],
 ['Quality Reviewer','Approved v1; v2 adds unsupported 5,000 cash journal; v1 handoff accepted; no originals accessible','Requested changes, independently calculated 5,000 difference, preserved version boundary, routed treatment to Accounting Lead, held v2 delivery and reported blocked.']],[30,85,105])
path=Path('deliverables/bookkeeping_100_client_rerun.xlsx');path.parent.mkdir(exist_ok=True);w.save(path)
r=load_workbook(path,data_only=False);assert len(r.worksheets)==11;assert r['100 clients'].max_row==101;assert r['Workflow checks'].max_row==41;print(str(path.resolve()))
