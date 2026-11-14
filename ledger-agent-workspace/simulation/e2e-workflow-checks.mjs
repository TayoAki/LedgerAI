// Isolated execution of the actual v3 model. No network, live database, real
// clients, external messages, accounting writes, or real approvals are used.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const workflowText = readFileSync(new URL('../lib/workflow.ts', import.meta.url), 'utf8');
const modelText = readFileSync(new URL('../lib/model.ts', import.meta.url), 'utf8');
const asModule = text => 'data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(text)).toString('base64');
const workflowUrl = asModule(workflowText);
const modelUrl = asModule(modelText.replace("from './workflow'", `from '${workflowUrl}'`));
const { initialState, applyAction, latest, laps } = await import(modelUrl);
const results = [];
const test = (name, fn) => { try { fn(); results.push({ name, pass: true }); } catch (error) { results.push({ name, pass: false, error: error.message }); } };
const deny = (fn, pattern) => assert.throws(fn, pattern);
const owner = 'fixture-owner@example.invalid';
const monthOffset = n => { const et = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); const d = new Date(et.slice(0, 7) + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 7); };
const period = monthOffset(-1);
const fresh = () => { const state = initialState(); state.tasks = []; return { state }; };
// Copy-on-write matches store.ts: rejected actions never commit partial changes.
const act = (b, action, human = false, trusted = false) => {
  const candidate = structuredClone(b.state);
  b.state = applyAction(candidate, action, human, trusted);
  return b.state;
};
const account = (n = 1, start = period) => ({
  id: `fixture-account-${n}`, email: `fixture-${n}@example.invalid`,
  profile: { business: `Isolated fixture ${n}`, contact: `Fixture ${n}`, start_period: start },
  files: [], items: [], messages: [],
});
const activate = (b, a = account(), extra = {}) => {
  act(b, { action: '_activate_portal', intake: a, company_id: `fixture-company-${a.id}`, service_scope: 'Monthly close preparation', engagement_evidence: `fixture://signed-engagement/${a.id}`, human_reviewer: owner, recurring: true, portal_authority: true, reminders: false, ...extra }, owner, true);
  return b.state.engagements.find(e => e.intake_id === a.id);
};
const setup = (n = 1, start = period) => { const b = fresh(), a = account(n, start); act(b, { action: '_ingest_portal', accounts: [a] }, false, true); activate(b, a); return { b, a, cid: `portal-${a.id}`, p: start }; };
const task = (c, kind) => c.b.state.tasks.find(t => t.client_id === c.cid && t.accounting_period === c.p && t.kind === kind);
const scope = t => ({ task_id: t.id, client_id: t.client_id, accounting_period: t.accounting_period });
const worker = t => ({ ...scope(t), role: t.owner, run_id: `fixture-run:${t.owner}:${t.id}` });
const claim = (c, kind) => { const t = task(c, kind); act(c.b, { action: 'claim_task', ...worker(t) }); return task(c, kind); };
const submit = (c, kind, extra = {}) => { const t = task(c, kind); act(c.b, { action: 'submit_deliverable', ...worker(t), title: `${kind} fixture artifact`, body: `Actual isolated ${kind} fixture content; original source IDs and judgments are described here.`, ...extra }); return latest(c.b.state, t.id); };
const done = (c, kind) => { const t = task(c, kind); act(c.b, { action: 'update_task', ...worker(t), revision: t.revision, status: 'Done' }); return task(c, kind); };
const handoff = (c, kind, receiver = task(c, kind).required_handoff) => {
  const t = task(c, kind), d = latest(c.b.state, t.id);
  act(c.b, { action: 'offer_handoff', ...worker(t), deliverable_id: d.id, receiver, note: `Inspect exact fixture version ${d.version}, sources and unresolved judgments.` });
  const h = c.b.state.handoffs.find(h => h.task_id === t.id && h.deliverable_id === d.id && h.to === receiver && h.status === 'Pending');
  act(c.b, { action: 'accept_handoff', ...scope(t), handoff_id: h.id, role: receiver });
  return c.b.state.handoffs.find(x => x.id === h.id);
};
const routine = (c, kind) => { claim(c, kind); submit(c, kind); handoff(c, kind); return done(c, kind); };
const request = c => {
  act(c.b, { action: 'request_document', ...worker(task(c, 'sources')), title: 'Original bank statement', due: `${c.p}-28`, idempotency_key: `fixture-source:${c.cid}:${c.p}`, note: 'Upload all original statement pages.' });
  return c.b.state.documents.find(d => d.client_id === c.cid && d.accounting_period === c.p);
};
const receive = (c, d) => {
  const a = structuredClone(c.a);
  a.files = [{ id: `file-${c.cid}`, name: 'statement.pdf', period: c.p, sha256: 'a'.repeat(64), request_id: `document:${d.id}` }];
  a.items = [{ id: `document:${d.id}`, kind: 'request', payload: { title: d.title, period: c.p } }];
  a.messages = [{ id: `message-${c.cid}`, item_id: `document:${d.id}`, sender: 'client', body: 'All statement pages uploaded.' }];
  act(c.b, { action: '_ingest_portal', accounts: [a] }, false, true);
  return a;
};
const inspectReceipts = c => {
  for (const receipt of c.b.state.inbox.filter(i => i.client_id === c.cid && i.owner === 'document_coordinator' && i.status !== 'Done')) {
    const base = { inbox_id: receipt.id, client_id: receipt.client_id, accounting_period: receipt.accounting_period, role: receipt.owner, run_id: `fixture-inbox:${receipt.id}` };
    act(c.b, { action: 'claim_inbox', ...base });
    const current = c.b.state.inbox.find(i => i.id === receipt.id);
    act(c.b, { action: 'resolve_inbox', ...base, revision: current.revision, status: 'Done', summary: 'Inspected fixture original and matched client/month.', evidence: `fixture://original/${receipt.id}; sha256=${'a'.repeat(64)}` });
  }
};
const sources = c => {
  claim(c, 'sources'); const d = request(c); receive(c, d); inspectReceipts(c);
  act(c.b, { action: 'verify_document', ...worker(task(c, 'sources')), document_id: d.id, source_file_id: `file-${c.cid}`, evidence: `fixture://original/file-${c.cid}; complete statement pages inspected for ${c.p}` });
  submit(c, 'sources'); handoff(c, 'sources'); done(c, 'sources');
};
const ready = c => { routine(c, 'intake'); sources(c); routine(c, 'readiness'); };
const review = (c, decision = 'Passed', extra = {}) => { const t = task(c, 'close'), d = latest(c.b.state, t.id); act(c.b, { action: 'technical_review', ...scope(t), role: 'quality_reviewer', deliverable_id: d.id, decision, note: `fixture://review/${d.id}: original totals, reconciliation and exceptions independently checked.`, ...extra }); };
const release = c => { const t = task(c, 'close'), d = latest(c.b.state, t.id); act(c.b, { action: 'review', ...scope(t), deliverable_id: d.id, decision: 'Approved' }, owner); };
const close = c => { claim(c, 'close'); submit(c, 'close'); review(c); release(c); handoff(c, 'close'); done(c, 'close'); return latest(c.b.state, task(c, 'close').id); };
const deliveryReady = c => { ready(c); const source = close(c); claim(c, 'delivery'); const d = submit(c, 'delivery', { source_deliverable_id: source.id, body: `Delivery manifest references original released packet ${source.id}; no restated figures.` }); return { source, d }; };
const begin = c => { const t = task(c, 'delivery'), d = latest(c.b.state, t.id); act(c.b, { action: '_begin_delivery', ...worker(t), deliverable_id: d.id }, false, true); return c.b.state.dispatches.find(j => j.deliverable_id === d.id); };
const finish = (c, dispatch) => act(c.b, { action: '_finish_delivery', dispatch_id: dispatch.id, evidence: `fixture://portal-receipt/${dispatch.id}; exact released source ${dispatch.source_deliverable_id}` }, false, true);

test('Untrusted ingestion and activation are rejected without changing state', () => {
  const b = fresh(), a = account(); const before = JSON.stringify(b.state);
  deny(() => act(b, { action: '_ingest_portal', accounts: [a] }), /Server-only/);
  deny(() => act(b, { action: '_activate_portal', intake: a }, false, true), /Signed-in owner/);
  assert.equal(JSON.stringify(b.state), before);
});
test('Signup routes one Sales inquiry, creates no client/tasks and records no LAPS sale', () => {
  const b = fresh(), a = account(); for (let n = 0; n < 3; n++) act(b, { action: '_ingest_portal', accounts: [a] }, false, true);
  assert.equal(b.state.inbox.length, 1); assert.equal(b.state.inbox[0].owner, 'sales'); assert.equal(b.state.clients.length, 0); assert.equal(b.state.tasks.length, 0); assert.deepEqual(laps(b.state), [0, 0, 0, 0]);
});
test('Inquiry claim and triage do not grant commercial acceptance', () => {
  const b = fresh(), a = account(); act(b, { action: '_ingest_portal', accounts: [a] }, false, true);
  const base = { inbox_id: `inquiry:${a.id}`, client_id: '', accounting_period: '', role: 'sales', run_id: 'fixture-sales' };
  act(b, { action: 'claim_inbox', ...base });
  act(b, { action: 'resolve_inbox', ...base, revision: b.state.inbox[0].revision, status: 'Done', summary: 'Qualified; await commercial acceptance.', evidence: 'fixture://discovery-notes' });
  assert.equal(b.state.clients.length, 0); assert.equal(b.state.engagements.length, 0);
});
test('Owner activation atomically records registry, terms and five scoped tasks', () => {
  const c = setup(); assert.equal(c.b.state.clients.length, 1); assert.equal(c.b.state.engagements.length, 1); assert.equal(c.b.state.tasks.length, 5);
  for (const t of c.b.state.tasks) { assert.equal(t.client_id, c.cid); assert.equal(t.accounting_period, c.p); for (const dep of t.dependencies) assert.ok(c.b.state.tasks.some(x => x.id === dep && x.client_id === t.client_id && x.accounting_period === t.accounting_period)); }
  assert.equal(c.b.state.inbox[0].status, 'Done'); assert.equal(c.b.state.config.payroll_enabled, false);
});
test('Exact activation retry is idempotent; conflicting acceptance is rejected atomically', () => {
  const c = setup(); activate(c.b, c.a); assert.equal(c.b.state.tasks.length, 5); const before = JSON.stringify(c.b.state);
  deny(() => activate(c.b, c.a, { service_scope: 'Payroll instead' }), /different terms/); assert.equal(JSON.stringify(c.b.state), before);
});
test('Prerequisites cannot be claimed before their exact dependencies finish', () => {
  const c = setup(); deny(() => claim(c, 'readiness'), /prerequisite/); deny(() => claim(c, 'close'), /prerequisite/); deny(() => claim(c, 'delivery'), /prerequisite/);
});
test('Routine intake completes on receiving-role acceptance without financial approval', () => {
  const c = setup(); claim(c, 'sources'); request(c); claim(c, 'intake'); const d = submit(c, 'intake');
  deny(() => done(c, 'intake'), /required receiver/); handoff(c, 'intake'); done(c, 'intake');
  assert.equal(task(c, 'intake').status, 'Done'); assert.equal(d.technical_status, 'Not required'); assert.equal(d.reviewer, undefined); assert.equal(task(c, 'intake').completed_by, 'client_success');
});
test('Missing originals block Sources even after receiving-role acceptance', () => {
  const c = setup(); claim(c, 'sources'); request(c); submit(c, 'sources'); handoff(c, 'sources'); deny(() => done(c, 'sources'), /originals remain unverified/);
});
test('Generic document creation cannot bypass the engaged-client Coordinator claim', () => {
  const c = setup(); deny(() => act(c.b, { action: 'request_document', client_id: c.cid, accounting_period: c.p, title: 'Unauthorized fixture request', due: `${c.p}-28`, idempotency_key: 'unclaimed-document', role: 'production', run_id: 'unclaimed-fixture' }), /claim|Coordinator|owner/i);
});
test('Upload/reply ingestion is idempotent and does not imply source verification', () => {
  const c = setup(); claim(c, 'sources'); const d = request(c), a = receive(c, d); act(c.b, { action: '_ingest_portal', accounts: [a] }, false, true);
  assert.equal(c.b.state.inbox.filter(i => i.client_id === c.cid).length, 2); assert.equal(c.b.state.documents[0].status, 'Missing');
  inspectReceipts(c); assert.equal(c.b.state.documents[0].status, 'Missing');
});
test('Verification requires claimed Document Coordinator scope; open receipts still block', () => {
  const c = setup(); claim(c, 'sources'); const d = request(c); receive(c, d);
  deny(() => act(c.b, { action: 'verify_document', ...worker(task(c, 'sources')), document_id: d.id, role: 'production', evidence: 'fixture://original' }), /Claim|Coordinator/);
  act(c.b, { action: 'verify_document', ...worker(task(c, 'sources')), document_id: d.id, source_file_id: `file-${c.cid}`, evidence: 'fixture://inspected-original' });
  submit(c, 'sources'); handoff(c, 'sources'); deny(() => done(c, 'sources'), /receipts/); inspectReceipts(c); done(c, 'sources');
});
test('Accounting readiness retains judgment and exact Production acceptance', () => {
  const c = setup(); routine(c, 'intake'); sources(c); claim(c, 'readiness'); const d = submit(c, 'readiness');
  const t = task(c, 'readiness'); act(c.b, { action: 'offer_handoff', ...worker(t), deliverable_id: d.id, receiver: 'production', note: 'Source completeness and judgment runbook.' });
  const h = c.b.state.handoffs[0]; deny(() => act(c.b, { action: 'accept_handoff', ...scope(t), handoff_id: h.id, role: 'sales' }), /receiving role/);
  act(c.b, { action: 'accept_handoff', ...scope(t), handoff_id: h.id, role: 'production' }); done(c, 'readiness'); assert.equal(task(c, 'readiness').completed_by, 'accounting_lead');
});
test('Production correction needs fresh independent review and exact owner release', () => {
  const c = setup(); ready(c); claim(c, 'close'); const first = submit(c, 'close'), t = task(c, 'close');
  deny(() => review(c, 'Passed', { role: 'production' }), /independent/);
  deny(() => release(c), /technical review/);
  act(c.b, { action: 'offer_handoff', ...worker(t), deliverable_id: first.id, receiver: 'client_success', note: 'Draft, not released.' }); const oldH = c.b.state.handoffs[0];
  review(c, 'Changes requested'); const second = submit(c, 'close', { body: 'Corrected fixture reconciliation and evidence index.' });
  assert.equal(second.version, 2); assert.equal(latest(c.b.state, t.id).technical_status, 'Pending');
  deny(() => act(c.b, { action: 'accept_handoff', ...scope(t), handoff_id: oldH.id, role: 'client_success' }), /Pending handoff|stale/);
  deny(() => act(c.b, { action: 'technical_review', ...scope(t), role: 'quality_reviewer', deliverable_id: first.id, decision: 'Passed', note: 'Old fixture packet' }), /latest/);
  review(c); deny(() => act(c.b, { action: 'review', ...scope(t), deliverable_id: second.id, decision: 'Approved' }), /signed-in/);
  release(c); deny(() => done(c, 'close'), /required receiver/); handoff(c, 'close'); done(c, 'close');
  assert.equal(task(c, 'close').completed_by, 'production'); assert.equal(latest(c.b.state, t.id).reviewer, owner);
});
test('Client Success must reference the exact released dependent Production packet', () => {
  const c = setup(); ready(c); const source = close(c); claim(c, 'delivery');
  deny(() => submit(c, 'delivery'), /exact latest/); deny(() => submit(c, 'delivery', { source_deliverable_id: 'wrong-packet' }), /exact latest/);
  const d = submit(c, 'delivery', { source_deliverable_id: source.id }); assert.equal(d.owner, 'client_success'); assert.equal(source.owner, 'production');
  deny(() => done(c, 'delivery'), /delivery evidence/);
});
test('Delivery outbox preserves approved original, authorization, receipt and authorship', () => {
  const c = setup(), { source } = deliveryReady(c), j = begin(c); assert.equal(j.payload.body, source.body); assert.equal(j.payload.preparer, 'production'); assert.equal(j.payload.deliverable_id, source.id); assert.equal(j.recipient, c.a.email);
  begin(c); assert.equal(c.b.state.dispatches.length, 1); assert.equal(task(c, 'delivery').delivery, null);
  finish(c, j); finish(c, j); assert.equal(c.b.state.dispatches[0].status, 'Sent'); done(c, 'delivery');
  assert.equal(task(c, 'delivery').completed_by, 'client_success'); assert.equal(task(c, 'delivery').delivery.source_deliverable_id, source.id);
});
test('Portal delivery rejects missing routine portal authority', () => {
  const c = setup(); c.b.state.engagements[0].portal_authority = false; deliveryReady(c); deny(() => begin(c), /portal authority/);
});
test('Pending dispatch locks supersession and human/technical review changes', () => {
  const c = setup(); deliveryReady(c); begin(c); const t = task(c, 'close'), d = latest(c.b.state, t.id);
  deny(() => act(c.b, { action: 'submit_deliverable', ...scope(t), title: 'Replacement', body: 'New fixture version' }, owner), /delivery is pending/);
  deny(() => act(c.b, { action: 'review', ...scope(t), deliverable_id: d.id, decision: 'Changes requested', note: 'Reopen fixture' }, owner), /delivery is pending/);
  deny(() => review(c, 'Changes requested'), /delivery is pending/);
});
test('Pending dispatch also locks task status changes', () => {
  const c = setup(); deliveryReady(c); begin(c); const t = task(c, 'close');
  deny(() => act(c.b, { action: 'update_task', ...scope(t), revision: t.revision, status: 'In progress' }, owner), /delivery is pending/);
});
test('Upstream rework cannot reuse an old routine artifact and accepted handoff', () => {
  const c = setup(); ready(c); const intake = task(c, 'intake');
  act(c.b, { action: 'submit_deliverable', ...scope(intake), title: 'Corrected intake', body: 'Updated authorized contacts.' }, owner);
  const current = task(c, 'intake'); act(c.b, { action: 'claim_task', ...worker(current) }); handoff(c, 'intake'); done(c, 'intake');
  claim(c, 'readiness'); deny(() => done(c, 'readiness'), /version|artifact|receiver|deliverable|resubmit|Changes requested/i);
});
test('Late original receipt invalidates downstream readiness before another publication', () => {
  const c = setup(); deliveryReady(c);
  const incoming = { ...c.a, files: [{ id: `late-file-${c.cid}`, name: 'Late original.pdf', period: c.p, sha256: 'c'.repeat(64) }] };
  act(c.b, { action: '_ingest_portal', accounts: [incoming] }, false, true);
  assert.equal(task(c, 'sources').status, 'Blocked'); inspectReceipts(c);
  deny(() => begin(c), /released|prerequisite|claim|current|packet|incomplete/i);
});
test('A late receipt waits behind a pending delivery snapshot then reopens source review', () => {
  const c = setup(); deliveryReady(c); const j = begin(c);
  const incoming = { ...c.a, files: [{ id: `late-file-${c.cid}`, name: 'Late original.pdf', period: c.p, sha256: 'c'.repeat(64) }] };
  act(c.b, { action: '_ingest_portal', accounts: [incoming] }, false, true);
  assert.equal(task(c, 'sources').status, 'Done'); assert.equal(c.b.state.dispatches[0].status, 'Pending');
  finish(c, j); act(c.b, { action: '_ingest_portal', accounts: [incoming] }, false, true); assert.equal(task(c, 'sources').status, 'Blocked');
});
test('Idempotent task/document/deliverable keys reject conflicting scope and content', () => {
  const c = setup(), intake = task(c, 'intake');
  const create = { action: 'create_task', client_id: c.cid, accounting_period: c.p, title: 'Fixture additional task', owner: 'operations', acceptance: 'Actual fixture evidence', idempotency_key: 'fixture-conflict-task' };
  act(c.b, create); act(c.b, create); deny(() => act(c.b, { ...create, accounting_period: monthOffset(-2) }), /key conflicts/);
  claim(c, 'sources'); const d = request(c); deny(() => act(c.b, { action: 'request_document', ...worker(task(c, 'sources')), title: 'Different source', idempotency_key: d.key }), /key conflicts/);
  claim(c, 'intake'); const p = { idempotency_key: 'fixture-artifact-key', body: 'First fixture body' }; submit(c, 'intake', p); submit(c, 'intake', p); deny(() => submit(c, 'intake', { ...p, body: 'Different fixture body' }), /key conflicts/);
  assert.equal(c.b.state.deliverables.filter(d => d.task_id === intake.id).length, 1);
});
test('Existing task keys reject changed dependencies and delivery policy', () => {
  const c = setup(); const a = { action: 'create_task', client_id: c.cid, accounting_period: c.p, title: 'Fixture policy task', owner: 'operations', acceptance: 'Actual fixture evidence', idempotency_key: 'fixture-policy-key', dependencies: [], requires_delivery: false };
  act(c.b, a); deny(() => act(c.b, { ...a, dependencies: [task(c, 'intake').id], requires_delivery: true }), /key conflicts/);
});
test('Cross-client and cross-month dependencies are rejected', () => {
  const c = setup(); activate(c.b, account(2)); const base = { action: 'create_task', title: 'Invalid dependency fixture', owner: 'production', acceptance: 'Fixture', client_id: c.cid, accounting_period: c.p };
  deny(() => act(c.b, { ...base, dependencies: [c.b.state.tasks.find(t => t.client_id !== c.cid).id] }), /same client and period/);
  deny(() => act(c.b, { ...base, accounting_period: monthOffset(-2), dependencies: [task(c, 'intake').id] }), /same client and period/);
});
test('Claim conflicts, revision checks and scope checks protect task and inbox work', () => {
  const c = setup(); const t = claim(c, 'intake'), revision = t.revision; deny(() => act(c.b, { action: 'claim_task', ...worker(t), run_id: 'competing-fixture-run' }), /already claimed/);
  deny(() => act(c.b, { action: 'release_claim', ...worker(t), accounting_period: monthOffset(-2) }), /must match/);
  submit(c, 'intake'); deny(() => act(c.b, { action: 'update_task', ...worker(t), revision, status: 'In progress' }), /changed/);
});
test('Expired claims deny mutations and can be reclaimed by another run', () => {
  const c = setup(); const t = claim(c, 'intake'); task(c, 'intake').lease.expires_at = '2020-01-01T00:00:00.000Z';
  deny(() => submit(c, 'intake'), /current run_id/);
  act(c.b, { action: 'claim_task', ...worker(t), run_id: 'replacement-fixture-run' }); assert.equal(task(c, 'intake').lease.run_id, 'replacement-fixture-run');
});
test('Source file binding rejects wrong client, wrong month and missing original', () => {
  const c = setup(); claim(c, 'sources'); const d = request(c); receive(c, d);
  const base = { action: 'verify_document', ...worker(task(c, 'sources')), document_id: d.id, evidence: 'fixture://original-inspection' };
  deny(() => act(c.b, base), /uploaded original/);
  deny(() => act(c.b, { ...base, source_file_id: 'another-client-file' }), /uploaded original/);
  const otherMonth = { ...c.a, files: [{ id: 'wrong-month-file', name: 'Wrong month.pdf', period: monthOffset(-2), sha256: 'd'.repeat(64) }] };
  act(c.b, { action: '_ingest_portal', accounts: [otherMonth] }, false, true); deny(() => act(c.b, { ...base, source_file_id: 'wrong-month-file' }), /uploaded original/);
  act(c.b, { ...base, source_file_id: `file-${c.cid}` }); assert.equal(c.b.state.documents[0].source_sha256, 'a'.repeat(64));
});
test('WIP cap is shared by inbox items and tasks, with release enabling next claim', () => {
  const c = setup(); const items = [1, 2, 3].map(n => ({ id: `support-${n}`, kind: 'service_request', payload: { title: `Support ${n}`, period: c.p, category: 'general' } }));
  act(c.b, { action: '_ingest_portal', accounts: [{ ...c.a, items }] }, false, true); claim(c, 'intake');
  const ib = n => ({ inbox_id: `request:support-${n}`, client_id: c.cid, accounting_period: c.p, role: 'client_success', run_id: `fixture-support-${n}` });
  act(c.b, { action: 'claim_inbox', ...ib(1) }); act(c.b, { action: 'claim_inbox', ...ib(2) }); deny(() => act(c.b, { action: 'claim_inbox', ...ib(3) }), /WIP limit/);
  act(c.b, { action: 'release_inbox', ...ib(1) }); act(c.b, { action: 'claim_inbox', ...ib(3) }); assert.ok(c.b.state.inbox.find(i => i.id === 'request:support-3').lease);
});
test('Recurring periods create exactly one new closed-month task graph', () => {
  const c = setup(1, monthOffset(-2)); act(c.b, { action: '_advance_periods' }, false, true); act(c.b, { action: '_advance_periods' }, false, true);
  const e = c.b.state.engagements[0]; assert.equal(Object.keys(e.periods).length, 2); assert.equal(c.b.state.tasks.length, 10); assert.ok(e.periods[period]); assert.equal(e.periods[monthOffset(0)], undefined);
  for (const t of c.b.state.tasks) for (const id of t.dependencies) { const dep = c.b.state.tasks.find(x => x.id === id); assert.equal(dep.accounting_period, t.accounting_period); assert.equal(dep.client_id, t.client_id); }
});
test('Nonrecurring engagement does not automatically add new periods', () => {
  const b = fresh(), a = account(1, monthOffset(-2)); activate(b, a, { recurring: false }); act(b, { action: '_advance_periods' }, false, true); assert.equal(b.state.tasks.length, 5);
});
test('100 isolated clients route and deduplicate requests, originals and replies', () => {
  const b = fresh(), accounts = Array.from({ length: 100 }, (_, n) => account(n + 1));
  act(b, { action: '_ingest_portal', accounts }, false, true); assert.equal(b.state.inbox.length, 100); for (const a of accounts) activate(b, a);
  const incoming = accounts.map(a => ({ ...a,
    files: [{ id: `file-${a.id}`, name: 'Fixture original.pdf', period, sha256: 'b'.repeat(64) }],
    items: ['documents', 'accounting', 'scope', 'general'].map(category => ({ id: `${a.id}-${category}`, kind: 'service_request', payload: { title: `${category} fixture request`, category, period } })),
    messages: [{ id: `${a.id}-reply`, item_id: `${a.id}-documents`, sender: 'client', body: 'Fixture follow-up' }],
  }));
  for (let n = 0; n < 3; n++) act(b, { action: '_ingest_portal', accounts: incoming }, false, true);
  assert.equal(b.state.clients.length, 100); assert.equal(b.state.tasks.length, 500); assert.equal(b.state.inbox.length, 700);
  for (const a of accounts) { const rows = b.state.inbox.filter(i => i.client_id === `portal-${a.id}`); assert.equal(rows.length, 6); assert.equal(rows.find(i => i.id === `request:${a.id}-scope`).owner, 'sales'); assert.equal(rows.find(i => i.id === `request:${a.id}-accounting`).owner, 'accounting_lead'); assert.equal(rows.find(i => i.id === `request:${a.id}-general`).owner, 'client_success'); assert.equal(rows.find(i => i.id === `reply:${a.id}-reply`).owner, 'document_coordinator'); }
  assert.equal(new Set(b.state.tasks.map(t => t.key)).size, 500); assert.deepEqual(laps(b.state), [0, 0, 0, 0]);
});
test('Full isolated journey finishes all five tasks with claims and separate role work', () => {
  const c = setup(), { source } = deliveryReady(c); const j = begin(c); finish(c, j); done(c, 'delivery');
  assert.ok(c.b.state.tasks.every(t => t.status === 'Done' && t.completed_by === t.owner && !t.lease));
  assert.equal(c.b.state.deliverables.find(d => d.id === source.id).owner, 'production');
  assert.equal(c.b.state.handoffs.filter(h => h.status === 'Accepted').length, 4);
  assert.ok(c.b.state.documents.every(d => d.status === 'Verified')); assert.ok(c.b.state.inbox.every(i => i.status === 'Done'));
  assert.equal(c.b.state.dispatches.filter(j => j.status === 'Sent').length, 1);
});

// Persistence check uses the actual store and real SQLite in memory with D1's
// transaction shape, so a model-only success cannot hide record-key collisions.
const storeText = readFileSync(new URL('../lib/store.ts', import.meta.url), 'utf8');
const sql = new DatabaseSync(':memory:');
for (const migration of ['0000_curly_living_mummy.sql', '0001_fat_centennial.sql']) sql.exec(readFileSync(new URL(`../drizzle/${migration}`, import.meta.url), 'utf8'));
const prepare = statement => ({ sql: statement, args: [], bind(...args) { this.args = args; return this; }, async first() { return sql.prepare(this.sql).get(...this.args); } });
globalThis.__ledgerE2EEnv = { DB: { prepare, async batch(statements) {
  sql.exec('BEGIN'); try { const out = statements.map(q => q.sql.startsWith('SELECT') ? { results: sql.prepare(q.sql).all(...q.args) } : { meta: { changes: sql.prepare(q.sql).run(...q.args).changes } }); sql.exec('COMMIT'); return out; } catch (error) { sql.exec('ROLLBACK'); throw error; }
} } };
const storeModule = storeText.replace("import { env } from 'cloudflare:workers';", 'const env = globalThis.__ledgerE2EEnv;').replace("from './model'", `from '${modelUrl}'`);
const { readState, writeAction } = await import(asModule(storeModule));
try {
  const activation = a => ({ action: '_activate_portal', intake: a, company_id: `storage-${a.id}`, service_scope: 'Monthly fixture close', engagement_evidence: `fixture://signed/${a.id}`, human_reviewer: owner, recurring: true, portal_authority: true });
  await Promise.all([writeAction(activation(account(801)), owner, true), writeAction(activation(account(802)), owner, true)]);
  const persisted = await readState(); assert.equal(persisted.engagements.length, 2, 'Both engagements must survive SQL read-back'); assert.equal(persisted.clients.length, 2); assert.equal(persisted.tasks.filter(t => t.workflow_version === 3).length, 10);
  await writeAction(activation(account(801)), owner, true); assert.equal((await readState()).engagements.length, 2);
  results.push({ name: 'Concurrent activation persists both engagements and five-task graphs through actual SQL store', pass: true });
} catch (error) { results.push({ name: 'Concurrent activation persists both engagements and five-task graphs through actual SQL store', pass: false, error: error.message }); }
try {
  const s = await readState(), t = s.tasks.find(t => t.kind === 'sources');
  const competing = await Promise.allSettled(['worker-a', 'worker-b'].map(run_id => writeAction({ action: 'claim_task', ...scope(t), role: 'document_coordinator', run_id })));
  assert.equal(competing.filter(r => r.status === 'fulfilled').length, 1); assert.equal(competing.filter(r => r.status === 'rejected').length, 1);
  const persisted = await readState(); assert.ok(['worker-a', 'worker-b'].includes(persisted.tasks.find(x => x.id === t.id).lease.run_id));
  results.push({ name: 'Concurrent SQL claims preserve exactly one task owner run', pass: true });
} catch (error) { results.push({ name: 'Concurrent SQL claims preserve exactly one task owner run', pass: false, error: error.message }); }
try {
  const a = account(803), base = { action: '_activate_portal', intake: a, company_id: `storage-${a.id}`, engagement_evidence: `fixture://signed/${a.id}`, human_reviewer: owner, recurring: true, portal_authority: true };
  const competing = await Promise.allSettled(['Monthly close', 'Quarterly close'].map(service_scope => writeAction({ ...base, service_scope }, owner, true)));
  assert.equal(competing.filter(r => r.status === 'fulfilled').length, 1); assert.equal(competing.filter(r => r.status === 'rejected').length, 1);
  const persisted = await readState(), e = persisted.engagements.find(e => e.intake_id === a.id); assert.ok(e);
  assert.equal(persisted.tasks.filter(t => t.client_id === e.client_id).length, 5); assert.ok(persisted.tasks.filter(t => t.client_id === e.client_id).every(t => t.description.includes(e.service_scope)));
  results.push({ name: 'Concurrent conflicting commercial acceptance commits one coherent engagement', pass: true });
} catch (error) { results.push({ name: 'Concurrent conflicting commercial acceptance commits one coherent engagement', pass: false, error: error.message }); }
sql.close(); delete globalThis.__ledgerE2EEnv;

const report = {
  at: new Date().toISOString(),
  method: 'Actual TypeScript stripped and imported in isolated memory; copy-on-write actions; synthetic fixtures and simulated signed owner only. No live data, network delivery, AI accounting judgment or scheduler execution tested.',
  hashes: Object.fromEntries([['model.ts', modelText], ['workflow.ts', workflowText], ['store.ts', storeText]].map(([key, content]) => [key, createHash('sha256').update(content).digest('hex')])),
  passed: results.filter(x => x.pass).length, failed: results.filter(x => !x.pass).length,
  tests: results,
};
writeFileSync(new URL('./e2e-workflow-results.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, tests: results.filter(x => !x.pass) }, null, 2));
if (report.failed) process.exitCode = 1;
