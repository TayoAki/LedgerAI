# Ledger v2 recurring operations

Canonical task app: this owner-private Ledger Site. Read workspace.config at the start of each run. Work windows remain weekdays 09:00 / 13:00 / 16:00 America/New_York; daily report 17:15. Marketing M/W/F; payroll disabled. Windows are flexible invocations, not worker-liveness guarantees.

Use installed read_workspace / update_workspace MCP tools when available. Alternatively obtain this project's current URL and service credential through Sites get_site and keep it in memory. GET /api/workspace reads the state; POST /api/workspace accepts one action. Send the credential only to this Site using OAI-Sites-Authorization: Bearer … and no Origin header. Do not use that credential for /mcp. Read back updates. Never log credentials, change sharing or republish to update business records.

## Roles

Operations routes work and reports. Marketing and Sales own the acquisition pipeline. Document Coordinator owns source requests/verification and intake manifests. Accounting Lead owns technical readiness, accounting judgments and human-release recommendations. Production prepares versioned close packets. Quality Reviewer independently checks the latest evidence and returns numbered findings. Client Success owns authorized delivery and retention. Payroll stays disabled. Role strings express workflow ownership inside one trusted service boundary; they are not separate authenticated service identities.

## Task contract

Register a client with create_client (client_id,name,company_id,service_scope). Client tasks require client_id and accounting_period YYYY-MM. Create tasks with title,owner,stage,acceptance; optional dependencies (existing same-client/period task IDs), required_handoff, requires_delivery,due,priority,idempotency_key. Firm tasks omit client scope.

Before agent task mutations, claim_task with task_id,client_id,accounting_period,role,run_id. Claims expire after 30 minutes and cap at three active tasks per role. Renew with same run_id; release_claim when work pauses. update_task additionally needs current revision. submit_deliverable needs title, actual body or HTTPS url and a stable idempotency_key. Supply scope,role,run_id on both. New versions supersede old approvals/handoffs/delivery evidence.

technical_review requires latest deliverable_id, scope, independent role quality_reviewer or accounting_lead, decision Passed/Changes requested and note with findings/evidence. Financial release uses signed-in human review only. Service calls cannot approve as human.

offer_handoff: task_id,scope,claim,deliverable_id,receiver,note. accept_handoff: handoff_id,scope,receiver role. Acceptance preserves task authorship; create dependent downstream tasks when needed. Completion requires current approved evidence, technical pass for client tasks, completed dependencies, required documents, required accepted handoff and any delivery receipt.

record_delivery: task_id,scope,role client_success,deliverable_id,recipient,evidence of actual authorized delivery. It records delivery; it does not send anything.

request_document: client_id,accounting_period,title,due,idempotency_key. verify_document: document_id,scope,role document_coordinator,evidence after inspecting originals. record_connection: role operations,name,status Verified/Failed/Unverified,evidence of actual observed access check. Access is stale after 24h for readiness displays; this is not an automatic provider probe.

record_run: role,run_id,summary,status Completed/Blocked/Failed/No work,task_ids,evidence,blockers,next_actions. Record only roles actually executed, with honest zero work. generate_report creates or refreshes one snapshot per ET day; schedule the end-of-day refresh after the final work window. Manual refreshes retain the same daily record ID. Reports retain missing run indicators, evidence, blockers and next actions; totals count today's completed tasks by original preparer.

record_event: type lead/appointment/presentation/sale,entity,at,evidence,test. No fictional data in live workspace. Test/live dedup keys are separate. void_event: event_id,role operations,note; retains audit evidence. Source completeness remains unknown until independently established.

## Persistence and simulation

D1 uses individual records plus transactional metadata CAS. First mutation imports the existing legacy workspace without deleting its backup. Completed tasks can be archived; audit rows are retained. UI paginates task/client lists; agent reads currently return the full workspace. Large evidence belongs in an authorized external document source.

Simulation tab is a saved isolated local test result. It does not run real bookkeeping, authenticate client tools or create fictional live tasks. Capacity budgets are explicit assumptions. No live provider access, real human approval or external delivery is inferred from simulation results.
