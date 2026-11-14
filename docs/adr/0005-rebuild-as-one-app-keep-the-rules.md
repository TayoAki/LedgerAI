# Rebuild as one app and carry over the workflow rules

Hosting, sign-in, the database, Firm separation and where the agents run are all changing, which leaves almost none of the original plumbing worth keeping. The split into two apps joined by a secret-protected bridge existed only because of the old host. Ledger is rebuilt as a single app with a Firm side and a Client side, keeping TypeScript, React and Drizzle so screens and logic can be moved across.

What carries over is the workflow rule engine in `ledger-agent-workspace/lib/model.ts` and `lib/workflow.ts`: claims, exact-version handoffs, independent review, human sign-off, and new sources invalidating downstream work. It is ported under the existing checks in `ledger-agent-workspace/simulation/` and `ledger-client-portal/tests/`, all of which passed on the original code on 2026-11-14.

## Consequences

The AI role agents become a scheduled runner inside Ledger using Claude, replacing the ChatGPT automations that run outside the code today.
