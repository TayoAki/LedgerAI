# Ledger Client Portal

Client-facing signup and onboarding companion to the owner-private Ledger workspace.

## Included
- ChatGPT sign-in, one business space per authenticated Site user ID.
- Draft and submitted business profiles, separate from accepted engagements.
- D1 persistence and R2 original uploads with account-scoped downloads, bounded bodies, type/size limits, SHA-256 and duplicate detection.
- Client requests/replies, team progress and exact-version released reports.
- Authenticated server-to-server bridge to Ledger. Anonymous and client APIs cannot access team endpoints.

Ledger remains the canonical task store. Reading its workspace syncs submitted intake metadata and replies; failures return a stale-cache warning. Drafts do not sync. The owner records actual signed-engagement evidence, scope, company and human reviewer before creating five idempotent client/month tasks. Source inspection, independent technical review, human release and delivery remain separate.

## Runtime
Sites supplies identity headers. D1 binding `DB`; R2 `BUCKET`. Configure `PORTAL_BRIDGE_SECRET` as a secret on both Sites. Never put it in source or browser code. The Ledger backend pins this portal origin. QuickBooks authorization is implemented through server-only Composio calls and stays Unconfigured until the two required values below are set. No email reminders are sent.

## Checks
`node node_modules/typescript/bin/tsc --noEmit`
`node --experimental-strip-types tests/portal-checks.mjs`
The integration suite expects the companion `../ledger-agent-workspace` checkout. It executes actual route/bridge code against isolated SQLite and in-memory objects, including 100 synthetic intake submissions. It never calls hosted APIs or writes simulation data to the business.

Build via the Sites build helper. SQL migrations are append-only. Hosted authentication and live end-to-end browser behavior need an actual authorized user; no real client has been onboarded by this build.

## Current limits
One business per signed-in user, 50 files/100 MB per business, 10 MB per file. No automatic email chasing, e-signature provider, malware scanner, or QuickBooks ledger writes. Authorization alone never marks the company verified. Uploads are served as attachments; PDF/image magic bytes checked, XLSX ZIP prefix checked, CSV text accepted. Original content still requires source review. Signed engagement is recorded from actual evidence by the owner. Portal publication proves availability to the linked account, not that a recipient read the report.


## Client requests, conversations and originals

`POST /api/portal` accepts `service_request` for an Active account with `period` (`YYYY-MM`), `category`, `title`, `body`, and `idempotency_key`. The item ID is `service:<account_id>:<key>`. Original client content remains immutable; an exact retry returns the account bundle, and conflicting content with the same key is rejected with 409. Categories used by the UI are `documents`, `accounting`, `scope`, `report`, and `other`.

`reply` accepts `id`, `reply`, and an optional stable `idempotency_key`. It appends to `portal_messages`; it never replaces the request or earlier messages. The UI supplies retry keys. `bundle.messages` contains `{id,account_id,item_id,sender,body,created_at}`. Database triggers prevent updates and deletes of messages. Older `payload.reply` values remain readable as historical content.

The bridge supports `put_message` (alias `append_message`) with `{account_id,id,item_id,body,sender:'team'}`. Retries are exact and immutable. `put_item` accepts `service_request` only for an existing client-created item and changes only `status`, `answer`, and `task_id`. Supported service statuses: Open, Queued, In progress, Blocked, Resolved. Original source request instructions are preserved. `report`, `engagement`, and `note` items reject conflicting retries under the same ID. A note can contain `{title,body,period,request_id}`.

Uploads accept an optional `request_id` in multipart form data. It must belong to the signed-in account, be an unresolved request, and match the upload month. The unique `(account_id,period,sha256)` index serializes duplicate uploads. A concurrent pending duplicate returns 202 and `pending:true`; it is not reported as a completed upload. An original cannot silently move between requests. Active business identity, accepted email, starting month and scope fields are frozen; phone updates remain possible, and other changes use a service request.

Migration `0001_whole_retro_girl.sql` adds conversations, connection state, file request linkage and the original uniqueness constraint. Existing duplicate original records would cause index creation to fail safely; the migration does not discard records or stored files.

## QuickBooks authorization contract

Required server configuration:

- Secret `COMPOSIO_API_KEY`: Composio project API key.
- `COMPOSIO_QUICKBOOKS_AUTH_CONFIG_ID`: QuickBooks auth config from the same project, configured for the intended production or sandbox environment in Composio.

No Composio secret belongs in the browser, source repository or portal records. OAuth credentials remain with Composio and Intuit. No account or credential is configured by this code change.

`GET /api/quickbooks` returns safe saved state. Authenticated, same-origin `POST /api/quickbooks` accepts only `{action:'connect'}` or `{action:'status'}` and requires an Active account when configured. Connect derives `user_id=ledger-client:<account_id>`, pins the configured auth config and callback to `https://ledger-client-portal.kingkamina.chatgpt.site/?connection=return`, reserves one pending flow, and calls `POST https://backend.composio.dev/api/v3/connected_accounts/link`. It stores the returned connected account ID and link expiry, and returns the hosted redirect URL to the same client. Retries reuse the unexpired pending flow. Callback navigation triggers a server check; callback query parameters never choose an account.

Status calls `GET /api/v3/connected_accounts/<stored_id>`. It checks account ID, user ID, auth config ID, QuickBooks toolkit and disabled flags. `ACTIVE` is authorization completion only. OAuth alone keeps `company_verified:false`; the public authorization route performs no company inspection, bookkeeping data reads, ledger writes or payroll execution. The private company-info route below returns evidence for an independent company check. There is no generic tool execution endpoint. These lifecycle calls do not consume a toolkit-version environment variable.

The safe sync projection `bundle.quickbooks` is `{configured,status,connected,checked_at,expires_at,company_verified,company_id,company_checked_at,company_checked_by,source_readiness}`. Company verification becomes true only for a recorded independent Accounting Lead inspection matching the current ACTIVE connection; source readiness stays Unknown in this connection projection. It excludes API secrets, redirect URLs and provider credentials. Config or user mismatches are displayed as `Configuration changed`.

Official contracts: [auth link](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/postConnectedAccountsLink), [account status](https://docs.composio.dev/reference/v3/api-reference/connected-accounts/getConnectedAccountsByNanoid), [QuickBooks configuration](https://docs.composio.dev/kb/guide/toolkits-quickbooks).

## Endpoint regression checks

`node tests/portal-end-to-end.mjs` executes the production portal, bridge, original-upload and connection handlers against isolated SQLite, object storage and local provider fixtures. Its output is `tests/portal-end-to-end-results.json`. No fixture reaches a live client or provider. The older `portal-checks.mjs` also covers the companion Ledger flow and must be kept aligned with its current workflow gates.


## Private accounting read boundary

`POST /api/accounting` is protected by `PORTAL_BRIDGE_SECRET`, not by client sign-in alone. Its body is `{action:'tool_schema'|'read',account_id,period,tool_slug,arguments?,expected_connected_account_ids?}`. `period` must be `YYYY-MM`, the portal account must be Active, and its stored Composio account must match the server-derived client user ID and configured auth config. Every schema/read request rechecks the provider account ID, user ID, config, toolkit, ACTIVE status and disabled flags.

The allowlist at pinned toolkit version `20261101_00` is `QUICKBOOKS_GET_COMPANY_INFO`, `QUICKBOOKS_GET_BALANCE_SHEET_REPORT`, `QUICKBOOKS_GET_GENERAL_LEDGER_REPORT`, `QUICKBOOKS_GET_PROFIT_AND_LOSS_REPORT`, `QUICKBOOKS_GET_REPORT_TRIAL_BALANCE`, and `QUICKBOOKS_GET_TRANSACTION_LIST_REPORT`. `tool_schema` returns the authenticated provider definition. `read` retrieves that exact schema, validates structured arguments (including declared fields, required values and types) and executes with the stored account, derived user ID and pinned version. Unsupported or incomplete schema shapes fail closed. There is no arbitrary tool, URL, proxy, custom-auth or version override.

The response includes `account_id`, `accounting_period`, `tool_slug`, `version`, `connection_checked_at`, `observed_at`, and `company_verified:false`. Schema requests also contain `schema`. Reads contain `connected_account_id`, the raw `result` (including provider `log_id` where supplied), and `successful` only when the provider explicitly reports success. The authorized Ledger caller must independently match the returned company to the accepted client and retain evidence. Report execution requires the actual provider schema to explicitly declare `start_date` and `end_date`. The server injects the first and last date of the requested month, rejects conflicting supplied dates and any `date_macro`, and refuses schemas with a nonempty default date macro. Missing date fields fail closed; aliases are never guessed. Returned `arguments` show the exact executed date bounds. Report reads additionally require a nonempty `expected_connected_account_ids` list from Ledger’s independent company confirmation; the saved connection must be included. This prevents a new connection from inheriting a prior company confirmation. Company-info and schema requests are exempt. The Ledger caller must require independent company inspection before report use. No transaction mutation, ledger-write or payroll tool is implemented. All provider requests use `redirect:'manual'` and reject non-success responses, including redirects, before handling bodies.


`record_company_check` is a private bridge action with `{account_id,connected_account_id,company_id,evidence,checked_at}`. Ledger sends it only after an Accounting Lead independently confirms an observed company-info response. The portal requires the current saved ACTIVE connection, real inspection fields and a valid nonfuture timestamp, stores `company-check:<account_id>` as kind `company_check`, and rejects stale/conflicting snapshots. The current snapshot may be replaced by a newer inspection, while Ledger remains the canonical history. This does not grant financial release. Public clients cannot record a company check; reconnecting, disabling or expiring the connection removes the verified projection until an applicable confirmation exists.
