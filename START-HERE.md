# Ledger source code

This archive contains both applications from the latest saved Ledger source versions as checked on November 14, 2026.

## Contents

- `ledger-agent-workspace/`: owner workspace, role/task workflow, claims, deliverables, independent technical review, human financial release, daily reports, portal bridge and agent-facing MCP API.
- `ledger-client-portal/`: client onboarding, source uploads, messages, requests, released reports, and Composio/QuickBooks connection code.
- `SOURCE-MANIFEST.json`: exact source commits and SHA-256 checksums of every included repository file.

Keep the two folders next to each other: some end-to-end tests use both.

## Dependencies and development

Requirements: Node.js 22.13 or newer and npm. Each application has its own package lock and dependencies.

For each application, from its folder:

```sh
npm ci
npm run build
npm run dev
```

Read each application's README for its specific workflow, tests and integration contracts. This is a Cloudflare Worker/Vinext application pair. The workspace needs a D1 database bound as `DB`; the portal needs its own D1 `DB` and R2 bucket `BUCKET`. Apply the included Drizzle SQL migrations through the host's migration process.

The applications rely on Sites authentication and server-supplied identity headers. Local startup alone does not recreate the hosted authentication, databases or integrations. Before hosting outside Sites, implement equivalent trusted authentication and access controls. Keep the owner workspace private.

## Required runtime configuration

- Both applications: the same new server-only `PORTAL_BRIDGE_SECRET`.
- Client portal, for QuickBooks: server-only `COMPOSIO_API_KEY` and `COMPOSIO_QUICKBOOKS_AUTH_CONFIG_ID` from the intended Composio project.
- Hosted origin checks, the server bridge destination and QuickBooks callback currently reference the existing Ledger URLs. Update these deliberately if deploying at different URLs.
- `.openai/hosting.json` preserves each existing Site project ID for source provenance. Retain it when updating that Site; register separate projects and update these IDs for a new deployment.

Never commit real secrets or put them in browser code. Example environment files below list names only.

## Checks

Owner workspace:

```sh
node node_modules/typescript/bin/tsc --noEmit
node simulation/e2e-workflow-checks.mjs
node simulation/accounting-checks.mjs
```

Client portal:

```sh
node node_modules/typescript/bin/tsc --noEmit
node tests/portal-checks.mjs
```

Tests use isolated synthetic fixtures. Never import their example clients or events into production. Passing them does not prove live accounting quality or real 100-client operating capacity.

## What a code download does not transfer

No runtime secrets, OAuth tokens, live database records, client uploads, node_modules, generated build output or Git history are included. Agent skills and recurring automations installed separately in ChatGPT are not automatically installed by this archive. Configure those separately; a role schedule in the app is not a running AI worker.

QuickBooks company access still needs a real authorized connection and independent verification. Human financial release remains required. Payroll stays disabled.
