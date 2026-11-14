# Ledger — private bookkeeping operations

Owner workspace: https://ledger-agent-workspace.kingkamina.chatgpt.site
Client portal: https://ledger-client-portal.kingkamina.chatgpt.site

## End-to-end workflow v3

1. A submitted client profile enters the durable Sales inbox. It is not a sale or registered engagement.
2. The signed-in owner records the actual accepted scope, company, signed agreement evidence and human financial reviewer. This atomically creates one client, one immutable engagement and five scoped tasks.
3. Client Success checks intake; Document Coordinator requests and inspects original sources; Accounting Lead decides readiness. Each submits an artifact and receives exact-version acceptance from the next role. Routine acceptance does not need human financial release.
4. Production prepares the close. Quality Reviewer independently checks it and any correction. The signed-in owner releases the exact version.
5. Client Success submits a delivery plan with `source_deliverable_id` referencing the released Production artifact. `portal_deliver` reserves that version, publishes its original content and persists an actual portal receipt. Pending dispatches remain locked across uncertain responses and are reconciled idempotently.
6. Uploads, client replies and service requests become assigned inbox items. New source evidence invalidates downstream readiness and release work. Resolving an inbox receipt is separate from verifying an original.
7. `advance_workflow` opens completed months only for authorized recurring engagements; publishes authorized progress and source requests; reconciles dispatches; and issues optional portal reminders at 2/5 business days, stopping on a client reply or linked upload.

## Authority and evidence

The owner selects recurring scope and routine portal authority while accepting the engagement. These permissions do not authorize email, publishing marketing assets, spending, new commercial commitments, ledger writes or payroll. Payroll remains disabled. Role IDs describe workflow ownership inside the private workspace, not separate security identities.

Agent task and inbox claims share the three-active-claims-per-role limit and expire in 30 minutes. Client tasks and dependencies remain exact client/month scoped. Internal trusted actions are unreachable through agent/human JSON payloads. Existing legacy tasks retain their original approval requirements.

`read_source` returns original uploaded bytes (CSV text, image content, PDF/XLSX resource). A download is not verification. `verify_document` for portal clients needs an original `source_file_id`, evidence and the scoped Document Coordinator task claim. Quality review is not human release.

## Runtime

Ledger uses D1 row records with optimistic compare-and-swap and atomic batches. `engagements`, `inbox` and `dispatches` have stable record IDs. The portal uses a separate D1 database and R2 originals. Server requests use the existing secret `PORTAL_BRIDGE_SECRET`, fixed portal origin and no credential-forwarding redirects. Never change site access to run a task or save data.

The existing weekday work automation should call `advance_workflow`, execute bounded role passes, reconcile again and save one actual `record_run` per executed role. Marketing works Monday/Wednesday/Friday. A schedule is not proof of execution. The daily report keeps No work distinct from Missing and reports current queues plus today's actual outputs.

QuickBooks OAuth is configured in the client portal using server-only Composio environment values. Authentication, usable company access and verified source completeness are separate. The read allowlist is company info, balance sheet, P&L, general ledger, trial balance and transaction list at pinned toolkit version `20261101_00`. The actual authenticated input schema is fetched before execution. Report schema must explicitly support `start_date` and `end_date`; dates are constrained to the requested month. Unsupported schemas fail visibly.

Use `accounting_schema` then `accounting_read` with scoped claimed work (or independent review of an existing packet). A successful company read creates an Accounting Lead `company_check` inbox item. The Lead inspects the original and uses `confirm_company` with exact claim/revision/accepted company ID and evidence. Reports require that exact confirmed connected-account ID. Provider results are retained privately with source hash and log ID; they become source-review inbox items, not verified evidence. `verify_document` can reference `accounting_read_id` after inspection. Identical report data deduplicates across provider log IDs. Oversized responses above 400 KB require a portal export and are not saved as complete sources. No accounting-write endpoint is enabled.

## Validation

- `node simulation/checks.mjs`: legacy workflow checks and isolated 100-client storage shapes.
- `node simulation/storage_checks.mjs`: actual SQL/CAS migration, atomic rollback and concurrent write checks.
- `node simulation/accounting-checks.mjs`: scoped read gateway, observed company confirmation, original report/hash binding and no inferred verification.
- `node simulation/e2e-workflow-checks.mjs`: v3 role flow, correction/release, source invalidation, claim conflicts, delivery locks, semantic idempotency, 100 clients and concurrent activation.
- In adjacent portal repository: `node tests/portal-checks.mjs` runs production handlers and the complete cross-app journey, including remote success followed by lost response and exact receipt recovery.
- `node node_modules/typescript/bin/tsc --noEmit` and `npm run build`.

All fixtures are isolated memory/SQLite/object storage. They do not measure AI bookkeeping quality, real provider access, real client load or completed scheduled runs. Do not import fixtures into production.
