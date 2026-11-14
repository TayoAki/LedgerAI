# Can a public, paid, multi-Firm Ledger run on ChatGPT Sites?

Researched on 2026-11-14. Every source below was seen on that date. This note feeds one decision: **where Ledger runs once it is a public product.**

## Summary in plain language

- **A Site can be public, but Ledger's current sign-in needs a ChatGPT account.** OpenAI's documentation says a Site can be shared with "Anyone on the internet" and opened without a ChatGPT account. The sign-in Ledger uses today ("Sign in with ChatGPT") only works for people who have a ChatGPT account, so every Firm staff member and every Client would need one. The documentation says a Site may have its own sign-in instead, but does not explain how.
- **Ledger is only safe today because its Site is private.** The owner workspace has no door of its own: the code trusts that ChatGPT Sites has already kept strangers out. Opening it to the public without rewriting that part would expose everything. This rewrite is needed wherever Ledger ends up.
- **Selling is allowed; moving money is not.** OpenAI's documentation allows selling goods or services through an outside payment company, which must be the only party handling card details. "Other financial transactions remain prohibited." Ledger as written only reads bookkeeping data and does not move money, but I could not open the full Terms to confirm how they treat a product that stores Clients' financial records.
- **Getting the data out is the weak point.** OpenAI's help centre says Sites has no built-in way to back up the database and uploaded files and restore them elsewhere. The source code can be exported; the live records cannot, except through export features Ledger would have to build into itself.
- **Sites is a beta that OpenAI can switch off.** The Terms (seen only as excerpts) call Sites a beta service and let OpenAI remove or disable a Site "at any time for any reason". I found no uptime promise.
- **Hosting is free until 31 December 2026, then metered.** From 1 January 2027 traffic and storage are charged in "credits" above a monthly allowance. Database storage is the expensive part. The database is capped at 10 GB per Site, which all Firms would share if Ledger stayed as one Site. A custom domain (your own web address) is supported on some plans.
- **The code is a standard Cloudflare app wearing a ChatGPT Sites wrapper.** It already uses Cloudflare's database (D1) and file storage (R2). Cloudflare's own documentation describes deploying this kind of app directly. Section 5 lists the pieces that would have to be replaced; none of this has been tried.
- **Bottom line:** nothing I found forbids a paid public product on Sites, but the sign-in, data-custody, beta and scale limits make it a risky permanent home for other Firms' Client books. The evidence supports treating Sites as where the prototype lives and planning the product on infrastructure the owner controls.

## How to read the detail

Each claim carries a source tag. The full list with addresses is at the end.

| Tag | Meaning |
| --- | --- |
| **S** | OpenAI documentation I read in full, directly (learn.chatgpt.com, developers.openai.com, or OpenAI's package on the npm registry). |
| **E** | An official OpenAI page (help.openai.com or openai.com) that **refused automated access (HTTP 403)**. I saw its content only as search-engine excerpts. Treat every E claim as **unverified until a person opens the page**. |
| **C** | Cloudflare documentation I read in full, directly. |
| **Code** | A file in this repository. |
| **L** | A community forum post. A lead only, not evidence. |

"Not documented" means I looked in the sources listed and found nothing; it does not mean the answer is no.

## 1. Who can sign in to a Site

### Who can open a Site

- A new Site is private: "limited to its owner and workspace admins until you change its access." The sharing options can include owner and admins; selected users or groups; invited external viewers; anyone in the workspace; and "Anyone on the internet, only when public publishing is enabled." (S3)
- "A public site is available without ChatGPT workspace access." (S3) The help centre is reported to say "Anyone can open a public Site without signing in to ChatGPT. The Site may still have its own sign-in feature." (E2)
- For anything short of public, a ChatGPT account is required: "invited visitors must sign in with the account that received access." (S3)
- In Enterprise workspaces public publishing is off by default and an admin must enable it. (S3, S6)
- The audience setting is a platform setting. It is not stored in this repository, so I could not check how the two existing Sites are set. (Code: both `.openai/hosting.json` files hold only binding names, a project ID and, for the workspace, `"capabilities": ["mcp"]`.)

### The built-in sign-in

- "Public sites can remain open to everyone while offering optional Sign in with ChatGPT for identity-aware features." Sites runs the flow on platform paths `/signin-with-chatgpt` and `/signout-with-chatgpt`, then passes the person's identity to the app in request headers. (S2)
- The documentation page lists two headers, `oai-authenticated-user-email` and `oai-authenticated-user-full-name`. (S2) OpenAI's own build plugin additionally documents `oai-authenticated-user-id` as "the stable user ID". (S12) Ledger relies on that ID. (Code: `ledger-client-portal/lib/portal.ts:5`)
- This sign-in is a ChatGPT account sign-in. A person with no ChatGPT account cannot use it. A help article is reported to say "anyone can sign in to participating apps and sites with ChatGPT" (E9). Whether that covers free accounts signing in to a Sites-hosted app is **not confirmed**.
- Region: an older version of the help article is reported to say Sites was not available on Free or Go plans, or in the EEA, Switzerland or the UK at launch; the current version is reported to omit this. (E2, E8) **Unverified, and it matters** if any Firm or Client is in Europe.

### Using the app's own sign-in instead

- The documentation acknowledges it three times but never explains it:
  - A table maps the need "Public sign-in or an external identity provider" to "An authentication-enabled site". (S2)
  - "A site's audience setting and any sign-in feature built into the site are separate controls." (S3)
  - The service-credential section says a site may also require "its own API credential" in the ordinary `Authorization` header, "which Sites preserves". (S2)
- **Not documented:** what an "authentication-enabled site" is, how to build one, or any limits on it. A Site is a server-side app with a database and outbound HTTPS (S1), so nothing I read prevents Ledger from keeping its own accounts and sessions on a public Site. That is my reading, not a documented recipe, and it is untested.
- "Sign in with ChatGPT" also exists as a separate product for independent websites. It is "currently available to selected commercial partners through a limited trial" and needs a registered client ID. (S9, S10, S8) So if Ledger left Sites, it could not simply keep the ChatGPT button without being admitted to that trial.

## 2. Custom domains, limits and pricing

### Custom domains

- "Where custom domains are available, you can connect an apex domain or subdomain that you already own. Sites doesn't register domains for you." You add DNS records that Sites gives you. "Custom domains aren't available in Enterprise workspaces at launch." (S4)
- Proposed price from 1 January 2027: 25 credits per domain per month, registration extra. (S1)
- **Not documented:** which plans have custom domains today, whether the `.chatgpt.site` address keeps working alongside, and whether Sign in with ChatGPT works on a custom domain.

### Limits

- Storage per Site: D1 database 10 GB; R2 file storage "No fixed storage limit". (S1) 10 GB is also Cloudflare's own maximum size for a single D1 database. (C2)
- "HTTP, HTTPS, and WebSockets are supported. Raw inbound and outbound TCP connections aren't supported." "Some frameworks, private networks, databases, background services, and hosting patterns aren't supported." (S1)
- "Every sites deployment URL is a production deployment." There is no separate test environment; you can save a version without deploying it. (S5)
- Sites are created, deployed and managed through ChatGPT on the web or desktop: "Sites doesn't have a standalone management view in the Codex CLI or IDE extension." (S5) **Not documented:** any way to create a Site automatically, for example one per Firm at sign-up.
- During the beta, hitting a plan limit is reported to mean "you may be unable to create a new Site, add storage, or keep a high-usage Site publicly available until usage is reduced." (E2)
- **Not documented:** request-rate limits, processing-time limits, maximum upload size, any uptime commitment or support response time.

### Pricing

- "Sites is included with eligible ChatGPT plans during public beta." (S7) "Hosting is free through December 31, 2026. Starting January 1, 2027, Plus, Pro, and Business customers will pay for hosting usage above their monthly allowance." A per-Site usage view is promised from 1 December 2026. (S1)
- Monthly allowance shared across all of an account's Sites: Plus 125 credits; Pro 375 credits; Business 125 credits per seat; Enterprise draws on its contract. (S1)
- Rates are labelled "proposed" and "approximate" (S1):

| What is used | Unit | Credits |
| --- | --- | --- |
| Site without storage | 1 Site per month | 0 |
| Site with storage, even an empty database | 1 Site per month | 25 |
| Traffic | 100,000 requests | 16 |
| Database storage | 1 GiB for a month | 150 |
| File storage | 1 GiB for a month | 3.75 |
| Custom domain | 1 domain per month | 25 |

- One page visit is "typically 30–50" requests. (S1)
- Worked example, my arithmetic from the table: Ledger's two Sites each have a database, so they would use about 50 credits a month before any traffic or data. One GiB of saved records adds 150. A Plus allowance (125) is exceeded by the two Sites plus half a GiB of records.
- **Not documented:** the price of a credit in money. "Credit purchase prices and applicable discounts depend on your plan or agreement." (S7) The same page prices desktop voice at both $0.05 and 1.25 credits per minute, which implies roughly $0.04 per credit; that is my inference, not a published rate.
- Building and editing a Site is charged separately, against the plan's Codex usage. (S1)

## 3. Commercial-use terms and financial data

I could not open the ChatGPT Sites Terms. Everything tagged E1 below must be checked by a person.

### Selling

- "You can sell goods or services and collect payments through a third-party payment processor. Payment-card data must be collected and processed solely by that provider, not by your site or OpenAI. Other financial transactions remain prohibited. You're responsible for the integration, fulfillment, refunds, customer support, and applicable taxes." (S1)
- The Terms are reported to say the same in section 2.6, adding that the operator is responsible for sanctions and anti-money-laundering compliance. (E1)
- I found no clause forbidding a subscription software business on Sites. I also found no clause expressly permitting one beyond the sentence above. The only resale restriction I saw concerns OpenAI-owned subdomains. (E1)

### Financial data

- The Terms are reported to say a Site "must not initiate, execute, or otherwise facilitate financial transactions" except e-commerce through a payment provider. (E1)
- The Terms are reported to forbid a Site from processing health information covered by HIPAA and payment-card data covered by PCI DSS, except card data handled solely by the payment provider. (E1) The documentation repeats the health-information ban. (S1)
- How this meets Ledger, from the code: the QuickBooks connection is read-only with a fixed allowlist, "No accounting-write endpoint is enabled", and payroll is disabled. (Code: `ledger-agent-workspace/README.md`, `ledger-client-portal/README.md`) Ledger therefore does not move money today.
- **Not documented and needs a legal reading:**
  - Whether storing Clients' bookkeeping records and bank statements is acceptable. I found no clause about accounting records either way.
  - Whether "facilitate financial transactions" could be read to cover bookkeeping.
  - Client uploads could contain full card numbers, which the Terms are reported to forbid a Site from processing.
  - Any later feature that writes to a ledger, pays bills or runs payroll would fall much closer to the prohibition.

### Other terms a paid product would live under

- Sites is "a Beta Service". OpenAI may "delete, remove, unpublish, or otherwise disable your ChatGPT Site, at any time for any reason". (E1)
- The operator is "solely responsible" for the Site, indemnifies OpenAI against claims from the Site's own visitors, and is the data controller for personal data the Site collects; a privacy policy is required where the law requires one. (E1, E5) A data processing addendum dated 9 July 2026 makes OpenAI the processor of that data. (E6)
- OpenAI "may display attribution text or links in your website footer or toolbar". (E1) **Not documented:** whether this can be removed.
- Data residency: one help article is reported to say Sites supports no data residency at launch; a release note of 15 October 2026 is reported to say new Sites in US or EU residency workspaces use the workspace's region. (E2, E3, E8) These conflict.
- Cloudflare is reported to be listed as the sub-processor that hosts Sites. (E7) I found no statement that OpenAI's SOC 2 audit covers Sites. (E13)

## 4. Data ownership and export

### Ownership

- "As between you and OpenAI ... Website Content is your Content", including content from the Site's visitors. OpenAI takes a licence limited to operating Sites. (E1)
- After the agreement ends, OpenAI "returns or deletes" hosted data at the operator's instruction. (E6) **Not documented:** in what form, or how to ask.

### Taking the data out of Sites

- Source code: "To save a copy of your Site's source code, ask Codex to export it." (E2) This repository is such a copy; `START-HERE.md` confirms it contains no live records, uploads or secrets. (Code)
- Database and files: "Sites doesn't have a built-in way to back up your database records and uploaded files together and restore them into a new Site." (E2)
- "Restoring an earlier version restores the code, not your database or uploaded files." Publishing "can modify the database before the new version goes live, and those changes may remain even if publishing fails." (E2; repeated by an OpenAI Support account on the community forum, L1)
- "Deleting a site permanently removes it. You can't restore a deleted site." (S4)
- Cloudflare's own tools would do the job if the owner held the Cloudflare account: `wrangler d1 export` writes a whole D1 database to a file, D1 can be restored to any minute in the last 30 days, and Cloudflare documents a tool for copying a bucket of files given credentials for both ends. (C1, C6, C8) On Sites the database and files sit in infrastructure OpenAI manages, and **no documentation gives a Site owner access to these tools.**
- Several Site owners asked on OpenAI's forum in October 2026 for a supported full export; none of the threads I saw contains one. (L1, L2, L3)
- What the code already offers, untested: the app can read its own data, so it can hand it out.
  - `GET /api/workspace` returns the whole workspace state. (Code: `ledger-agent-workspace/app/api/workspace/route.ts`)
  - The portal's bridge returns Client accounts 100 at a time and individual uploaded files, protected by `PORTAL_BRIDGE_SECRET`. It skips accounts still in Draft. (Code: `ledger-client-portal/app/api/bridge/route.ts`)
  - These are application-level copies, not a database dump. A complete export route would have to be written and a restore rehearsed.

### Can the same code be deployed to Cloudflare directly?

- The app is built for Cloudflare Workers: it uses `vinext`, `@cloudflare/vite-plugin` and `wrangler`, and reads its database and files through Cloudflare bindings named `DB` and `BUCKET`. (Code: `ledger-agent-workspace/package.json`, `vite.config.ts`, `db/index.ts`; `ledger-client-portal/lib/portal.ts`)
- Cloudflare recommends vinext "as the default way to run Next.js applications on Cloudflare Workers", supports bindings through `cloudflare:workers`, and deploys with `npx @vinext/cloudflare deploy`. Cloudflare also says "vinext is in beta." (C7)
- The repository pins `vinext` 1.0.0-beta.5 (published 2026-08-07); the current release is 1.4.5. (Code: `package.json`; C9)
- So the answer is **probably yes, with the changes in section 5, but nobody has tried it.** There is no Cloudflare configuration file in the repository, and the database ID in `vite.config.ts` is a placeholder.
- Cost context on Cloudflare's own price list: the paid Workers plan starts at $5 a month including 10 million requests; D1 includes 5 GB and then costs $0.75 per GB a month; R2 costs $0.015 per GB a month. (C3, C4, C5)

## 5. What would have to be replaced if Ledger left Sites

All from the repository. Both apps share the same scaffolding, so most rows apply twice.

| Piece | What Sites does today | Where it shows in the code | What replaces it |
| --- | --- | --- | --- |
| **The outer door** | Sites decides who may reach the app at all. | The workspace does no checking of its own on `GET /api/workspace`, `GET /api/portal` (including file downloads) or `POST /mcp`. A `POST /api/workspace` with no `Origin` header is treated as an agent with no credential check. Any signed-in person who reaches the workspace is treated as the human owner; there is no owner list. (`ledger-agent-workspace/app/api/workspace/route.ts`, `app/api/portal/route.ts`, `app/mcp/route.ts`, `lib/workflow.ts`) | Ledger's own check on every request, and rules that keep each Firm's data apart. **This is the largest item and is needed on any host, including a public Site.** |
| **Sign-in** | Sites serves `/signin-with-chatgpt`, `/signout-with-chatgpt` and `/callback`. | `ledger-client-portal/app/page.tsx` lines 5 and 21 link to them. `app/chatgpt-auth.ts` in both apps wraps them but nothing imports it. | Ledger's own sign-in pages and sessions, or an outside sign-in provider. |
| **Identity headers** | Sites adds `oai-authenticated-user-id`, `-email`, `-full-name` and `-full-name-encoding` to each request and strips forged ones. | Read directly in `ledger-agent-workspace/app/api/workspace/route.ts`, `app/api/portal/route.ts` and `ledger-client-portal/lib/portal.ts:5`. Portal accounts are keyed on the Sites user ID (`portal_accounts.user_id`, `ledger-client-portal/db/schema.ts`). | Identity taken from Ledger's own verified session. Outside Sites these headers can be forged by anyone, so they must not be trusted. Existing portal accounts need a mapping from the old ID to the new one. |
| **Service credential** | A per-Site token sent as `OAI-Sites-Authorization: Bearer …`. "Sites consumes this header before forwarding the request", so the app never sees it. One token per Site; making a new one replaces the old. (S2) | Described only in `ledger-agent-workspace/AUTOMATION.md`. No code checks it. | Keys that Ledger issues and checks itself, one per Firm or per agent. |
| **Agent connection (MCP)** | Sites hosts the workspace's `/mcp` endpoint as a ChatGPT plugin and controls who may call it. | `"capabilities": ["mcp"]` in `ledger-agent-workspace/.openai/hosting.json`; `app/mcp/route.ts`. | Ledger's own authorisation on `/mcp`. |
| **Database and file bindings** | Sites creates the D1 database and R2 bucket and injects them. | Names in `.openai/hosting.json` (`DB`; `BUCKET` for the portal). `vite.config.ts` turns them into local settings with a placeholder database ID. Used through `env.DB` and `env.BUCKET` in `db/index.ts`, `lib/store.ts`, `lib/portal-bridge.ts`, `lib/portal.ts`, `app/api/files/route.ts`, `app/api/bridge/route.ts`. | On Cloudflare: a real configuration naming a real database and bucket; the code that uses them can stay. On any other host: a different database and file store, and that code changes too. |
| **Database migrations** | Sites applies the SQL files when a version is published. | `drizzle/*.sql`; copied into the build by `scripts/vite/sites-vite-plugin.ts`. | A migration step run by the owner's own deploy process. |
| **Secrets** | Stored in the Site's settings. | `PORTAL_BRIDGE_SECRET`, `COMPOSIO_API_KEY`, `COMPOSIO_QUICKBOOKS_AUTH_CONFIG_ID` (`owner.env.example`, `portal.env.example`). | The new host's secret store. |
| **Connected-apps binding** | Sites passes a `CONNECTORS` capability with each request. | `worker/index.ts`, `lib/connector-*.ts`, `lib/connectors.ts`, `scripts/connector-preview/`, `scripts/vite/connector-preview-plugin.mjs`. No route calls it; QuickBooks goes through Composio over HTTPS instead. | Nothing. It can be deleted. |
| **Build scripts** | The Sites starter wraps install, build and local preview. | `scripts/run-framework.mjs`, `build-verified.sh`, `sites-env.sh`, `sites-env.mjs`, `install-ci.*`, `install-pnpm.sh`, `npm-install.mjs`, `pnpm-install.mjs`, `execution-profile.mjs`, `tool-environment.mjs`, `scripts/vite/sites-vite-plugin.ts`; the `dev`, `build`, `start` and `install:ci` entries in `package.json`; `.sites-runtime` in `.gitignore`, `tsconfig.json` and `eslint.config.mjs`. About 1,300 lines per app. | The standard vinext build and deploy commands. The local fake sign-in in `sites-vite-plugin.ts` goes with it. |
| **Fixed web addresses** | The two `.chatgpt.site` addresses are written into the code. | `ledger-agent-workspace/lib/portal-bridge.ts:6`, `lib/accounting.ts:4`, `ledger-client-portal/app/api/quickbooks/route.ts:38` (the QuickBooks return address), both READMEs and three test files. | Configuration values, and the QuickBooks return address updated at Composio. |
| **Project link** | Ties the source to the hosted Site. | `project_id` in `.openai/hosting.json`. | Removed. |

Two things outside the code would also be left behind:

- Publishing, versions, visitor analytics, web address and certificate are all provided by Sites. (S4)
- The AI agents themselves run as skills and scheduled automations in the owner's ChatGPT account, not in this code. (Code: `START-HERE.md`, `AUTOMATION.md`) That is a separate dependency on ChatGPT and is not covered here.

## What this means for the decision

The decision is where Ledger runs once it is a public product.

1. **Staying on Sites does not save the hard work.** The workspace has no access checks of its own and stores a single workspace under one fixed ID, `main` (Code: `ledger-agent-workspace/lib/store.ts`). Sign-in, per-Firm separation and agent credentials must be built whichever host is chosen.
2. **Sites adds risks a product holding other Firms' Client books should not carry by default:**
   - no documented way to back up or move the database and files;
   - a beta that OpenAI may disable at any time, with no uptime promise found;
   - a 10 GB database ceiling per Site and no documented way to create Sites automatically;
   - one shared service token per Site;
   - unresolved questions about Europe, data residency and financial records.
3. **Sites does offer real conveniences:** free hosting until the end of 2026, a custom domain, permission to charge through a payment company, and building by conversation. These suit a prototype, a demo or a pilot with one friendly Firm.
4. **The least-change exit is the owner's own Cloudflare account.** The database and file code stays; the pieces in section 5 are replaced. Other hosts are possible but would also mean replacing the database and file storage. This note did not compare hosts.
5. **Whatever is decided, two things are worth doing before real Client data accumulates on Sites:** build and rehearse an export of the records and files, and have someone read the full Terms.

What would change this picture: OpenAI documenting a supported export and restore; Sites leaving beta with a service commitment; documentation for running your own sign-in on a public Site; a clear statement that accounting records are acceptable.

## Open questions

1. **Terms.** What do the full ChatGPT Sites Terms and the beta section of the Service Terms say about financial records, suspension, notice, liability and termination? A person needs to open and read them.
2. **Financial data.** Does OpenAI consider a bookkeeping product, with bank statements and read access to QuickBooks, an acceptable use of Sites?
3. **Own sign-in.** What is an "authentication-enabled site", and can a public Site run its own accounts and sessions without restriction?
4. **ChatGPT sign-in reach.** Can people with free ChatGPT accounts, and people in the EEA, Switzerland and the UK, sign in to and use a public Site?
5. **Identity carry-over.** Is `oai-authenticated-user-id` the same identifier the separate Sign in with ChatGPT product returns? This decides whether existing portal accounts can follow their owners off Sites.
6. **Export.** Is there any supported way to get a full copy of a Site's database and files, or to use Cloudflare's 30-day restore? This is a question for OpenAI Support.
7. **Money.** What does a credit cost on the owner's plan, are the January 2027 rates final, and what happens to a Site that exceeds its allowance?
8. **Limits.** Are there request-rate, processing-time or upload-size limits?
9. **Assurance.** Is there any uptime commitment, and is Sites inside OpenAI's SOC 2 scope?
10. **Residency.** Which statement about data residency is current?
11. **Branding and copying.** Can the ChatGPT toolbar and attribution be removed? Can visitors to a public Site "Remix" it and so copy its code?
12. **Custom domain.** Is it available on the owner's plan today, and does sign-in work on it?
13. **Per-Firm Sites.** Is there any supported way to create and manage many Sites automatically?
14. **Ownership.** Which ChatGPT account owns the two Sites, and what happens to them if that account changes plan or workspace? (A help article is reported to warn that Sites may not transfer automatically. E11)
15. **Trial deployment.** Does this code, on its pinned vinext beta, actually build and run on a plain Cloudflare account? Only a test will tell.

## Sources

### OpenAI documentation read directly (2026-11-14)

- **S1** Sites overview, limits and pricing: https://learn.chatgpt.com/docs/sites.md
- **S2** Data and connections: https://learn.chatgpt.com/docs/sites/data-and-connections.md
- **S3** Publish and share: https://learn.chatgpt.com/docs/sites/publishing-and-sharing.md
- **S4** Manage a site: https://learn.chatgpt.com/docs/sites/managing-a-site.md
- **S5** Create a site: https://learn.chatgpt.com/docs/sites/creating-a-site.md
- **S6** Sites administration: https://learn.chatgpt.com/docs/enterprise/sites.md
- **S7** Pricing: https://learn.chatgpt.com/docs/pricing.md
- **S8** DevDay 2026 notes, dated 29 September 2026: https://learn.chatgpt.com/docs/whats-new/devday-2026.md
- **S9** Sign in with ChatGPT quickstart: https://developers.openai.com/siwc/quickstart.md
- **S10** Sign in with ChatGPT on your website: https://developers.openai.com/siwc/website.md
- **S11** Sign in with ChatGPT, user guide: https://learn.chatgpt.com/docs/sign-in-with-chatgpt.md
- **S12** `@openai/sites-vite-plugin` 0.2.0, published 2026-08-05, README inside the package: https://registry.npmjs.org/@openai/sites-vite-plugin

### OpenAI pages that refused automated access; seen only as search excerpts (2026-11-14)

- **E1** ChatGPT Sites Terms: https://openai.com/policies/chatgpt-sites-terms/
- **E2** Creating and using ChatGPT Sites (earlier title "Creating and managing ChatGPT sites"): https://help.openai.com/en/articles/20001339
- **E3** Managing ChatGPT Sites for your workspace: https://help.openai.com/en/articles/20001338-managing-chatgpt-sites-for-your-workspace
- **E4** Understanding responsibilities for your ChatGPT Sites: https://help.openai.com/en/articles/20001337-understanding-responsibilities-for-your-chatgpt-sites
- **E5** Complying with data protection laws for ChatGPT Sites: https://help.openai.com/en/articles/20001340
- **E6** ChatGPT Sites Data Processing Addendum: https://openai.com/policies/chatgpt-sites-data-processing-addendum/
- **E7** Sub-processor list: https://openai.com/policies/sub-processor-list/
- **E8** ChatGPT release notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- **E9** Sign in with ChatGPT: https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt and Using your ChatGPT plan in other apps and sites: https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites
- **E10** Hosting a plugin with ChatGPT Sites: https://help.openai.com/en/articles/20001547-hosting-a-plugin-with-chatgpt-sites
- **E11** Migrating your personal workspace to ChatGPT Business or Enterprise: https://help.openai.com/en/articles/8801890-migrating-your-personal-workspace-to-chatgpt-business-or-enterprise
- **E12** Service Terms: https://openai.com/policies/service-terms/
- **E13** Enterprise privacy at OpenAI: https://openai.com/enterprise-privacy/

### Cloudflare documentation read directly (2026-11-14)

- **C1** D1 import and export, updated 21 April 2026: https://developers.cloudflare.com/d1/best-practices/import-export-data/
- **C2** D1 limits, updated 30 October 2026: https://developers.cloudflare.com/d1/platform/limits/
- **C3** D1 pricing, updated 30 October 2026: https://developers.cloudflare.com/d1/platform/pricing/
- **C4** R2 pricing, updated 30 October 2026: https://developers.cloudflare.com/r2/pricing/
- **C5** Workers pricing, updated 13 November 2026: https://developers.cloudflare.com/workers/platform/pricing/
- **C6** D1 Time Travel, updated 6 November 2026: https://developers.cloudflare.com/d1/reference/time-travel/
- **C7** Next.js on Workers with vinext, updated 5 November 2026: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- **C8** R2 Super Slurper migration, updated 21 April 2026: https://developers.cloudflare.com/r2/data-migration/super-slurper/
- **C9** `vinext` package versions and dates: https://registry.npmjs.org/vinext

### Community posts, leads only (2026-11-14)

- **L1** "Deployment Blocked — Production D1/R2 Access and Migration Safety", 17–18 October 2026, with a reply from the OpenAI_Support account: https://community.openai.com/t/chatgpt-sites-deployment-blocked-production-d1-r2-access-and-migration-safety/1407087
- **L2** "Need a verified full backup and independent restore procedure", 27 October 2026: https://community.openai.com/t/chatgpt-sites-need-a-verified-full-backup-and-independent-restore-procedure/1410102
- **L3** "Are automatic database backups and point-in-time recovery available?", seen only as a search listing: https://community.openai.com/t/chatgpt-sites-are-automatic-database-backups-and-point-in-time-recovery-available/1397425

### Not reached

- The source repository for OpenAI's Sites tooling (`github.com/openai/sites`, named in S12) was outside what this session could read.
- No full-text copy of any E page was obtained.

### Repository files read

`START-HERE.md`, `GLOSSARY.md`, `docs/adr/0001-software-for-firms-not-a-bookkeeping-service.md`, `owner.env.example`, `portal.env.example`, and in both apps: `README.md`, `package.json`, `vite.config.ts`, `.openai/hosting.json`, `worker/index.ts`, `app/chatgpt-auth.ts`, `db/index.ts`, `lib/connector-*.ts`, `lib/connectors.ts`, `scripts/`. In the workspace: `AUTOMATION.md`, `app/api/workspace/route.ts`, `app/api/portal/route.ts`, `app/mcp/route.ts`, `lib/store.ts`, `lib/portal-bridge.ts`, `lib/accounting.ts`, `lib/workflow.ts`. In the portal: `app/page.tsx`, `app/api/files/route.ts`, `app/api/bridge/route.ts`, `app/api/portal/route.ts`, `app/api/quickbooks/route.ts`, `lib/portal.ts`, `db/schema.ts`. No script in the repository was run.
