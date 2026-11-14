# OpenBot as the place Ledger's AI agents run: what it gives and what it costs

Research note, 2026-11-14. It feeds one decision: where Ledger's AI agents run and who pays for the AI. It lays out facts and trade-offs and makes no recommendation.

## Summary

- **One OpenBot deployment is one organisation's workspace.** A deployment is one running copy of OpenBot. Its own API description says an install "has exactly one organization". Serving many unrelated Firms today means one deployment per Firm. CopilotKit's sales page describes keeping each customer's data separate inside one deployment, but nothing in the published code does that, and the page does not say whether it is available.
- **The free parts are not enough to sell a product.** OpenBot's application code is free to copy and rebrand. It will not start without a second CopilotKit product, "Intelligence", and the free Intelligence licence forbids production use, hosting it for others and reselling it.
- **No published price or contract covers "we sell this to Firms".** The two public price lists are $29 or less per active person per month (OpenBot for Business) and $49 per month including 10,000 agent requests (Intelligence alone). CopilotKit's standard online terms limit use to the buyer's "internal business purposes" and forbid resale. Selling to Firms would need a signed agreement whose price is not public.
- **The Bots could do the role agents' job, with limits.** They can run on a schedule, call Ledger's MCP endpoint and pause for a person's approval. A schedule cannot fire more often than every 15 minutes, a person can have 20 schedules switched on, each schedule belongs to a named person, and schedules cannot be pre-installed for a new Firm.
- **OpenBot's approval is not Ledger's sign-off.** OpenBot can make a Bot stop and ask a person before it uses a tool. Ledger's accountant sign-off happens inside Ledger and stays there. Because Ledger offers one all-purpose "update" tool, OpenBot could ask about every update or none, not only the risky ones.
- **It would replace one part of Ledger: the thing that wakes the agents and runs them**, which today is scheduled ChatGPT automations on the owner's account. The bookkeeping rules, the Client portal, QuickBooks access, billing and Firm sign-up would all still have to be built or kept in Ledger.
- **It does not decide who pays for the AI.** OpenBot does not sell AI. Whoever's AI-provider key is put into a deployment pays that provider directly, so it could be Ledger or the Firm. The CopilotKit licence is an extra cost either way.
- **It needs its own servers and someone to run them.** OpenBot runs in containers or on Kubernetes with PostgreSQL, which is a different kind of hosting from Ledger's. It is also new: version 1.0 was announced on 2026-11-10 and the hosted version is in early access.

## How to read this note

Everything was read on **2026-11-14**.

- OpenBot repository paths are relative to `/home/user/copilotkit/openbot/`, a copy of the `main` branch at commit `6a4abaf` (`package.json` says version 1.0.3). Ledger paths are relative to `/home/user/LedgerAI/`.
- A claim with no marker was read in the cited document.
- **[inferred from code]** means the documentation is silent and the claim comes from source code.
- **[inferred]** means it is my reasoning or arithmetic from cited facts.
- **[not verified]** means I could not confirm it from a primary source.

Two limits on the evidence:

1. **The server's source code is not in the copy I was given.** On `main`, the server, the schedule worker, the Bots' computers and the Kubernetes chart are no longer in the repository; they are downloaded as ready-built images (`CHANGELOG.md:222-228`, `docs/development.md:88`). They are still in the public repository at tag `v1.0.3`. I read three files from that tag, so those claims describe v1.0.3 and may differ on `main`.
2. **Web pages and the v1.0.3 files were read through a fetch tool that returns extracts.** Quotations from them are short fragments. Anyone relying on a licence clause should read the page itself.

## 1. Tenancy: one deployment per Firm

**What the repository says**

| Fact | Source |
| --- | --- |
| "Until multi-organization lands, an OpenBot install has exactly one organization", addressed as `default`; any other value is treated as an organisation that does not exist. | `api/openapi.yaml:18-21`, `:392-393` |
| The app sends every request to the organisation `default`. | `app/src/lib/api/request.ts:27-31` **[inferred from code]** |
| A deployment has one brand, one set of Bots and one set of channels, loaded from one "tenant package" directory. "Tenant" here means the one organisation a deployment is configured for. | `docs/configuration.md:70`, `:1201-1235` |
| A Bot marked `public` is visible to "Everyone in the deployment". Administrators see the whole audit trail and manage everyone who has signed in. | `docs/coworkers.md:54-59`, `README.md:395-396` |
| Without the Kubernetes-only supervisor, all Bots share one computer, which "is not fine as a boundary between tenants". | `docs/deployment.md:67-72` |
| In v1.0.3 server code, schedules are stored per owning person, with no organisation column. | `server/src/routines/store.ts` at tag v1.0.3 on GitHub |

**Sign-in.** A deployment signs people in through Google, Microsoft or Okta, or through a company's own SAML or OpenID Connect provider chosen by email domain (`docs/configuration.md:406-429`, `:548-549`). The documentation describes no email-and-password sign-in **[inferred]**. Several companies could be admitted to one deployment by email domain, but they would share one workspace, one set of administrators and one audit trail, which is not separation between Firms **[inferred]**.

**What the sales page says.** `https://open.bot/business` has a "Multi-tenancy" item: "Isolate each customer's data in its own tenant, with its own settings and access controls" and "while super-admins oversee them all", plus token limits "per tenant and per person". The page gives no availability status for these. I found no code or documentation for them in the repository (a search for "super-admin", "per tenant" and "multi-organization" finds only the lines above). Whether this exists, in which edition, and whether it gives each Firm its own sign-in is **[not verified]**.

**Related facts.** Several deployments can share one Intelligence project, each stamping the conversations it owns (`README.md:468`, `docs/configuration.md:71`). The Kubernetes guide at v1.0.3 says each release's bundled Intelligence creates its own organisation and project (`charts/openbot/README.md` at tag v1.0.3). A self-hosted Intelligence runs as "single org" by default (`https://docs.copilotkit.ai/intelligence/self-hosting`).

**What follows.** With the published code, separate data and separate sign-in for each Firm means one OpenBot deployment per Firm **[inferred]**. Creating a deployment is an operator task (install, database, web address, sign-in provider, first administrator's email, licence; `docs/deployment.md:133-143`), not something a Firm does by signing up. The API's key and app sign-in methods for automation are both marked "The server does not accept it yet" (`api/openapi.yaml:364-385`), so setting up a new Firm's Bots automatically has no supported credential today **[inferred]**.

## 2. Licence and price

### What is free and what is not

| Part | Licence | Source |
| --- | --- | --- |
| OpenBot application source | MIT: use, modify, sublicense and sell are permitted. The README says "You can fork, modify, and white-label it." | `LICENSE`, `README.md:107` |
| Server, worker, computer and supervisor on `main` | Shipped as images from `ghcr.io/copilotkit/…`; source not in the repository. The licence of the images is **[not verified]**. At tag v1.0.3 the source is in the repository under the same MIT file. | `backend-images.env`, `docker-compose.yml:59`, GitHub tree and `LICENSE` at tag v1.0.3 |
| Names and logos | A changed version shared outside your company needs "its own name and logo"; "Built on OpenBot" and "based on OpenBot" are allowed. | `https://open.bot/legal/trademarks` |
| CopilotKit Intelligence | "Separately licensed". The server refuses to start without an Intelligence address and key. | `README.md:97`, `:107`, `:435-441` |

### Which Intelligence licence production needs

- The README's table: a laptop needs a free local licence, a Kubernetes evaluation needs a free trial licence, and "Kubernetes / production" "Requires a production Intelligence license beyond evaluation. OpenBot for Business includes Intelligence for use with OpenBot." (`README.md:109-113`)
- The free licence is the "CopilotKit Intelligence Developer Edition License Agreement", last updated 2026-10-01 (`https://copilotkit.ai/legal/developer-edition`). It allows "Non-Production Use" only. Production use includes anything that "supports any internal business operation, customer-facing service, or revenue-generating activity". It bars "offering it as a hosted or managed service" and "sell, resell, rent, lease, lend, sublicense, distribute". Section 4.4: "Any Production Use of CopilotKit Intelligence requires a paid CopilotKit Intelligence license under a Signed Agreement."

### Published prices

**OpenBot for Business** (`https://open.bot/pricing`)

| Plan | Price | Notes |
| --- | --- | --- |
| OpenBot | Free | Personal use on a laptop. |
| Pay as you go | "Up to $29 / user / month" | The rate "falls as your team grows"; the page's calculator shows $20.75 per active user for a $2,075 plan. Self-hosted, or hosted by CopilotKit "in early access" at the same price. |
| Annual | "Custom pricing" | Adds "SSO and role-based access control", offline deployment, "Custom contract terms", 24/7 support. |

- An active user is "A named person with at least one interaction with OpenBot for Business in the billing month." "Bots, agents, API calls, and guests are never counted."
- Both paid plans add "5% of monthly model spend above $5,000 per organization". "You continue to pay your model providers directly."
- "Your OpenBot for Business license covers CopilotKit Intelligence to run OpenBot for Business. Building agents into your own product requires a separate Intelligence license."
- "The service terms for the complete offering are separate from that source license." The page links to no such terms.
- Single sign-on is listed under Annual only, here and on the Intelligence price list. The repository sets up Google, Microsoft or Okta sign-in through settings and describes no licence check on it (`docs/configuration.md:408-424`). Whether pay as you go entitles a deployment to company sign-in is **[not verified]**.

**CopilotKit Intelligence alone** (`https://www.copilotkit.ai/pricing`)

| Plan | Price | Notes |
| --- | --- | --- |
| Free | Free | "Free for non-production use with a renewable 30-day license." Hosted: 1,000 interactions per organisation per month. |
| Pay as you go | "$49 / month" per organisation | Includes 10,000 interactions, "then graduated rates"; the rates are not on the page. Self-hosted needs an internet connection "to report usage for billing". |
| Annual | "Custom pricing" | Offline use, custom SSO, custom contract terms; available as an AWS Marketplace private offer. |

- "One successfully completed agent request is one interaction." Tool and model calls inside a request are not counted separately.
- The same page calls OpenBot for Business "a separate product with its own license".
- CopilotKit's self-hosting guide says self-hosting is "available on the Team self-hosted plan or a custom Enterprise plan" (`https://docs.copilotkit.ai/intelligence/self-hosting`). Those plan names are not on the pricing page. An open issue on CopilotKit's own tracker reports the mismatch and has no reply from a person (`https://github.com/CopilotKit/CopilotKit/issues/8283`, opened 2026-11-09). Which plan allows production self-hosting is **[not verified]**.

### Do the terms allow selling a product built on OpenBot to Firms?

No public document I found says yes or no in so many words. The relevant texts:

- **CopilotKit Self-Service Agreement**, last updated 2026-08-10 (`https://www.copilotkit.ai/self-service-agreement`). It governs self-service use where no signed agreement applies.
  - Section 8.2 grants "a limited, non-exclusive, non-transferable, non-sublicensable, revocable right" to use the Services for "internal business purposes during the Subscription Term".
  - Section 5(b): the customer must not "sell, resell, sublicense, or otherwise commercially exploit the Services except as permitted here". Section 5(d): nor "use the Services to build or train a competing product or model".
  - Section 2.1: an Authorized User is "an individual within Customer's workforce". Section 2.6: an End User is "any person who interacts with Customer's products or applications that incorporate or are built using the Services", and "End Users are users of Customer's products, not of the Services."
  - The agreement does not name OpenBot or Intelligence.
- **CopilotKit Terms of Service** (`https://www.copilotkit.ai/terms-of-service`): a restriction on using the Services "to build similar or competitive services"; open-source parts follow their own licences. No date shown.

What this adds up to **[inferred]**:

- The MIT licence lets Ledger rebrand and sell the application code. It does not cover Intelligence, and its cover of the back-end images on `main` is unconfirmed.
- The self-service terms anticipate a customer building its own product with CopilotKit's services for its own end users. They also limit use to internal business purposes and forbid resale. A Firm's staff signing in to a rebranded OpenBot workspace are not in Ledger's workforce, and it is unclear whether they would count as Ledger's "End Users" or as people being resold the service.
- The pricing page sends "building agents into your own product" to a separate Intelligence licence, and the Annual plans offer "Custom contract terms". So the route to selling to third parties is a signed agreement. Its price and conditions are **[not verified]**.

## 3. Fit: could Bots do what the role agents do?

Ledger's contract today (`ledger-agent-workspace/AUTOMATION.md`, `app/mcp/route.ts`, `README.md`): eight active roles (payroll is disabled) run on weekdays at 09:00, 13:00 and 16:00 New York time, with a report at 17:15 and Marketing on three days (`lib/model.ts:2-12`, `:27`). They use three MCP tools: `read_workspace`, `read_source` and `update_workspace`, the last taking an `action`. A claim lasts 30 minutes with three active claims per role (`lib/model.ts:70-71`). "Financial release uses signed-in human review only. Service calls cannot approve as human."

### Running on a schedule

| Fact | Source |
| --- | --- |
| A routine is a standing instruction that fires on a schedule and posts the Bot's reply into a conversation. | `docs/routines.md:3-6` |
| The schedule is a five-field cron expression with a time zone. The form offers one time per routine; anything else is set by asking a Bot. | `app/src/lib/routines/form.ts:10-16`, `:196-211` **[inferred from code]**; `docs/routines.md:54-56` |
| "A routine may fire at most every 15 minutes." "A person may have at most 20 routines switched on at once." | `docs/routines.md:106-115` |
| Both limits are fixed in code, not settings; the cap is counted per owning person. | `server/src/routines/schedule.ts`, `store.ts` at tag v1.0.3 |
| A routine's instruction is at most 2,000 characters. | `app/src/lib/routines/form.ts:104-114` **[inferred from code]** |
| "A routine runs as the person who created it", with that person's own permissions. | `docs/routines.md:182-190` |
| A missed run is skipped, not replayed. | `docs/routines.md:131-144` |
| Ten failures in a row switch a routine off until a person turns it back on. | `docs/routines.md:117-129` |
| Nothing fires without a separate worker. On Kubernetes the chart runs it; the one-container image needs an outside scheduler. | `docs/routines.md:146-180`, `docs/deployment.md:74-87` |
| There is no administrator view of other people's routines, and "a tenant package cannot yet ship routines". | `docs/routines.md:199-203` |

Against Ledger's schedule **[inferred]**:

- The three daily windows are hours apart, so the 15-minute floor does not bind. It would bind if Ledger later wanted agents to react within minutes on a timer.
- One routine per role with three times a day is about nine routines for one person, under the cap. One routine per role per window is about 25, over the cap for one person.
- The schedule is about 500 runs per Firm per month (seven roles, three windows, about 22 weekdays, plus Marketing and the daily report).
- Each Firm's routines would have to be created after its deployment exists, by a named person at that Firm or on their behalf, because they cannot be shipped in the package.
- Ledger already treats windows as "flexible invocations, not worker-liveness guarantees" (`AUTOMATION.md:3`), which matches skipped runs.
- I found no documented maximum length for an unattended run, so how a long run sits with Ledger's 30-minute claim is **[not verified]**.

### Calling Ledger's MCP endpoint

- Any remote MCP server can be added by its address and given to Bots. OpenBot handles three cases: no sign-in, OAuth sign-in for each person, or one key for the server that only an administrator may supply (`docs/plugins/mcp-by-url.md:3-12`).
- The address must be `https`, with no IP addresses, no `localhost` and no redirects (`docs/plugins/mcp-by-url.md:32-38`).
- MCP tools are granted to each Bot by an administrator, or by the Bot's owner where an administrator has allowed that. Every call is checked against the grant and the policy, then recorded (`docs/architecture.md:326-333`).
- Ledger's endpoint answers the standard `initialize`, `tools/list` and `tools/call` requests (`ledger-agent-workspace/app/mcp/route.ts:5-9`), so the protocol should fit. I did not test it **[not verified]**.
- Ledger's `/mcp` route has no sign-in check of its own; it relies on its current host (`START-HERE.md`, "Before hosting outside Sites, implement equivalent trusted authentication") **[inferred from code]**. Any outside agent runner, OpenBot included, needs Ledger to add its own check for each Firm.
- Ledger's role names "are not separate authenticated service identities" (`AUTOMATION.md:9`). Under OpenBot every Bot would reach Ledger with the same person's sign-in or the same server key, so that would not change **[inferred]**.

### Stopping for a human approval

- OpenBot asks before deleting, sending, sharing, posting, paying, and changing credentials or security settings. It recognises these by the tool's name or by a "destructive" flag the tool carries (`docs/approvals.md:3-16`, `:37-46`, `:91-96`).
- Other changes do not ask unless the person turns on "Extra vigilant" or "Auto-review" or adds a rule (`docs/approvals.md:98-108`).
- A rule names a Bot, a tool, an effect and a scope (`app/src/lib/approvals.ts:42-48`); the policy can read the MCP server, tool and effect (`docs/architecture.md:50-67`). Neither reads the tool's arguments **[inferred from code]**.
- A pending approval waits in an inbox, and the server continues the conversation once the person answers (`app/src/lib/copilot/server-owned-interrupts.ts:6-11`) **[inferred from code]**.

Against Ledger's contract **[inferred]**:

- The name `update_workspace` contains none of the words that ask, so by default a Bot would call it without asking.
- A rule could make every `update_workspace` call ask, including routine claims and run records. It could not single out, say, `portal_deliver`, because the action is an argument. Targeted approval would need Ledger to offer separate tools or mark some as destructive.
- Ledger's financial release is enforced by Ledger for a signed-in person and cannot be given through the MCP endpoint. OpenBot's approval would be an extra gate in front of the Bot, not a replacement.

## 4. What it would replace, and what it would not

| Part of Ledger | With OpenBot | Basis |
| --- | --- | --- |
| Waking the agents and running them (today: scheduled ChatGPT automations on the owner's account) | Replaced by routines and Bots. | Section 3 |
| Each role's instructions and skills (today: installed separately in ChatGPT, `START-HERE.md`) | Would be rewritten as Bot roles and OpenBot skills, which a package can ship. | `docs/configuration.md:1249-1305`, `:1401` **[inferred]** |
| A record of what each agent did | Added: an audit trail of every tool call, with what started it. Ledger keeps its own run and task records. | `docs/architecture.md:99-125` |
| A place for Firm staff to talk to the agents | Added: conversations with Bots. Ledger has none today. | `docs/how-openbot-works.md:28-32` |
| Bookkeeping workflow and its rules (claims, handoffs, reviews, release) | Not replaced. They live in Ledger's code and database behind the MCP endpoint. | `ledger-agent-workspace/README.md:18-22` |
| The accountant's sign-off | Not replaced. | Section 3 |
| Client portal | Not replaced. OpenBot's people are signed-in members of the workspace; it has no Client-facing portal. | `ledger-client-portal/README.md` **[inferred]** |
| QuickBooks access | Not replaced as built. Ledger's portal has each Client authorise QuickBooks through Composio with a fixed read-only list. OpenBot also uses Composio, but connects apps "as the person asking" or as one shared account for the deployment. Whether QuickBooks is in its catalogue is **[not verified]**. | `ledger-agent-workspace/README.md:30-32`, `docs/plugins/composio.md:3-9` |
| Billing and Firm sign-up | Not provided. The documentation has no billing or self-serve sign-up feature. | Search of `docs/` and `README.md` **[inferred]** |
| Sign-in for Firm staff in Ledger itself | Not replaced. OpenBot signs people in to OpenBot only. | **[inferred]** |

## 5. Running cost and operating burden

### What it needs

| Shape | Needs | Source |
| --- | --- | --- |
| One container | At least 2 GB memory, 1 vCPU and 4 GB disk; 4 GB and 2 vCPU recommended. PostgreSQL with the `vector` extension. A sign-in provider, TLS, an encryption key, an Intelligence address and key, a model key. Something outside the container to fire routines and clear unsent attachments. All Bots share one computer. | `docs/deployment.md:113-170`, `:74-98` |
| Kubernetes (Helm chart) | The only shape that runs schedules by itself, gives each person a separate Bot computer and runs more than one server copy. Needs amd64 nodes and a default storage class. | `docs/deployment.md:243-247`, `README.md:119-123` |
| Kubernetes, per the v1.0.3 guide | "the vanilla install requests about 3.25 vCPU"; the AWS example uses three `t3.large` nodes. It bundles Intelligence with its own databases, Redis and object storage. The bundled PostgreSQL is "not production-grade". The routines job runs "every five minutes". | `charts/openbot/README.md` at tag v1.0.3 |
| Intelligence, self-hosted separately | Kubernetes 1.28 or later, PostgreSQL 14 or later, Redis 7 or later, a sign-in provider, ingress and TLS; three services with two copies each by default. | `https://docs.copilotkit.ai/intelligence/self-hosting` |
| Intelligence, hosted by CopilotKit | "a project and an API key and no cluster to operate". The region where data is kept is not stated. | `https://docs.copilotkit.ai/intelligence/managed-intelligence-platform` |

Ledger's two apps run on Cloudflare Workers with D1 and R2 (`START-HERE.md`). OpenBot cannot run there; it would be a second hosting stack beside Ledger's **[inferred]**.

### Rough infrastructure figure

AWS list prices: the Kubernetes control plane is "$0.10 per cluster per hour" (`https://aws.amazon.com/eks/pricing/`) and a `t3.large` is $0.0835 per hour in US East (`https://aws.amazon.com/ec2/instance-types/t3/`). The guide's three-node example is therefore about $73 plus $183, roughly **$256 per month for one cluster**, before a production database, storage, a load balancer and data transfer **[inferred]**. With one deployment per Firm, the 3.25 vCPU repeats for each Firm unless Firms' deployments share one Intelligence **[inferred]**.

### Other running costs

- **AI spend.** Model keys are deployment settings (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`; `docs/configuration.md:72-80`), paid to the provider directly. Automatic Learning "uses your model key too" (`README.md:157`). I did not estimate the spend of a role run.
- **A subscription instead of a key.** A deployment can run Bots on a ChatGPT or Claude plan sign-in (`docs/configuration.md:81`). Whether the AI providers allow that for a commercial service to many Firms is **[not verified]**.
- **CopilotKit licence.** See section 2.
- **Composio**, if apps are connected through OpenBot: its own charges, not researched.

### Skills to keep it running

- Kubernetes and Helm, or container hosting plus an outside scheduler.
- PostgreSQL: backups, and the `vector` extension's ownership rule (`docs/deployment.md:57-63`).
- Web addresses, TLS and a sign-in provider registration for each deployment (`docs/configuration.md:563-564`).
- Secrets: the encryption key must be kept, or stored credentials cannot be read after a restore (`charts/openbot/README.md` at tag v1.0.3).
- Upgrades: database changes run at upgrade and "A database that has run them does not go back: restore the backup" (`CHANGELOG.md`, "Unreleased").
- Watching that the routines job keeps running; without it "a routine is stored … and it never fires" (`docs/deployment.md:85-87`).

**Maturity.** Version 1.0 was announced on 2026-11-10 (`https://www.copilotkit.ai/blog/introducing-openbot-1-0`). Hosted deployments are "early access" (`https://open.bot/pricing`). The repository's changelog is about 8,400 lines, and the move of the server out of the source tree happened after v1.0.3.

## 6. Alternatives for running the agents

Named for comparison only; none was researched for this note.

- **Stay as it is, per Firm.** Each Firm connects its own ChatGPT, Claude or other MCP-capable assistant to Ledger's MCP endpoint and schedules it there. The Firm pays for the AI; Ledger supplies the endpoint and the rules.
- **Run the agents inside Ledger's own back end.** Ledger calls an AI provider's API on a timer in its existing hosting. Ledger pays for the AI, or each Firm supplies a key.
- **A managed agent service from an AI or cloud provider.** OpenBot's README lists several: Amazon Bedrock AgentCore, Claude Managed Agents, Google's Agent Platform, LangChain's managed agents, Microsoft Foundry Agent Service (`README.md:82`).
- **A general job runner plus an AI API.** A workflow or queue service handles schedules and retries, and Ledger's code holds the agent loop.
- **Firms bring their own OpenBot.** A Firm that buys OpenBot for itself adds Ledger as an MCP server. Ledger neither operates nor resells OpenBot.
- **CopilotKit Intelligence without OpenBot.** The "building agents into your own product" route the pricing page names, with Ledger's own screens.

## What this means for the decision

The decision is where the AI agents run and who pays for the AI.

**OpenBot answers the first half and leaves the second open.** The agents would run in an OpenBot deployment. Who pays the AI provider depends only on whose key is configured there. Either way a CopilotKit licence and hosting are added.

**Three arrangements are consistent with the facts.**

| Arrangement | Where agents run | Who pays for AI | What the facts say |
| --- | --- | --- | --- |
| Ledger operates OpenBot for each Firm | One deployment per Firm, run by Ledger | Ledger, or the Firm's key per deployment | Needs a signed agreement with CopilotKit (price unknown). Setting up a Firm is an operator task, which works against self-serve sign-up. Hosting and upkeep multiply with Firms. Gives Firms a chat workspace, approvals and an audit trail without Ledger building them. |
| Each Firm brings its own agent runner | The Firm's ChatGPT, Claude, OpenBot or similar | The Firm | Ledger resells nothing and runs no agent hosting. Ledger depends on each Firm setting up its schedules and keeping them running, and learns that a run happened only from what the agent records ("A schedule is not proof of execution", `ledger-agent-workspace/README.md:28`). |
| Agents run inside Ledger | Ledger's own back end | Ledger, priced into the subscription, or the Firm's key | No CopilotKit licence and no second hosting stack. Ledger must build the schedule, retries, AI calls and any agent-facing screens. |

**True whichever is chosen.**

- Ledger's MCP endpoint needs its own sign-in check for each Firm once it leaves its current host.
- The bookkeeping rules and the accountant's sign-off stay in Ledger.
- The Client portal, QuickBooks access, billing and Firm sign-up are outside what OpenBot provides.

**Facts that weigh most.** OpenBot serves one organisation per deployment today. Its licence for resale is not public. The owner is not an engineer, and the first and third arrangements both need ongoing engineering, of different kinds: operating infrastructure in the first, building software in the third.

## Open questions

For CopilotKit:

1. Will CopilotKit license OpenBot and Intelligence for a rebranded product sold to third-party Firms? Under which plan, at what price, and do a Firm's staff count as billable active users?
2. Is the multi-tenancy on `open.bot/business` available? In self-hosted or hosted form? Does it give each Firm its own sign-in and keep its data separate?
3. What licence covers the back-end images now that the server source has left `main`? Will the source stay public, and may a fork change the server?
4. Does one routine run count as one Intelligence "interaction"? What are the rates after 10,000?
5. Does pay as you go include Google and Microsoft sign-in, or is all single sign-on on the Annual plan?
6. Can a new deployment's Bots and routines be created automatically, given that API keys are not accepted yet and packages cannot ship routines?
7. How long may an unattended run last, and what happens to a run that is waiting for an approval nobody answers?
8. Where does hosted Intelligence keep data, and what data-processing terms apply to Clients' financial records?

For Ledger:

9. How will the MCP endpoint identify a Firm and its agents once it is hosted outside its current platform?
10. Should `update_workspace` be split into separate tools so that an agent runner can ask a person about specific actions?
11. Is it acceptable for a Firm's schedules to belong to one named person at that Firm, and to stop if that person leaves?

## Not verified, in one place

- Whether one OpenBot deployment can keep several Firms separate (stated on a sales page; absent from the published code).
- The price and terms of any agreement allowing resale or white-label to third parties.
- The licence of the published back-end images on `main`.
- Which CopilotKit plan allows production self-hosting of Intelligence.
- Whether pay as you go includes company sign-in.
- Whether a routine run counts as one billable interaction, and the rates beyond 10,000.
- Whether OpenBot's MCP client works with Ledger's endpoint (not tested).
- Any maximum length of an unattended run.
- Whether QuickBooks is in OpenBot's app catalogue.
- Whether AI providers allow a subscription plan sign-in to power a commercial multi-Firm service.
- The AI spend of a typical role run.
- That `main` behaves as the three v1.0.3 server and chart files describe.

## Sources

All read 2026-11-14.

**OpenBot repository** (`/home/user/copilotkit/openbot/`, `main` at `6a4abaf`): `README.md`, `LICENSE`, `CHANGELOG.md`, `backend-images.env`, `docker-compose.yml`, `package.json`, `api/openapi.yaml`, `docs/architecture.md`, `docs/configuration.md`, `docs/deployment.md`, `docs/how-openbot-works.md`, `docs/routines.md`, `docs/approvals.md`, `docs/coworkers.md`, `docs/development.md`, `docs/plugins/mcp-by-url.md`, `docs/plugins/composio.md`, `docs/desktop-install.md`, `docs/TELEMETRY.md`, `app/src/lib/api/request.ts`, `app/src/lib/routines/form.ts`, `app/src/lib/routines/plan.ts`, `app/src/lib/approvals.ts`, `app/src/lib/copilot/server-owned-interrupts.ts`, `app/src/lib/plugins/mutations.ts`.

**OpenBot on GitHub at tag v1.0.3** (through a fetch tool): `https://github.com/CopilotKit/OpenBot` (file listing of `main`), `https://github.com/CopilotKit/OpenBot/tree/v1.0.3` (file listing), and under `https://raw.githubusercontent.com/CopilotKit/OpenBot/v1.0.3/`: `LICENSE`, `docs/routines.md`, `docs/deployment.md`, `server/src/routines/store.ts`, `server/src/routines/schedule.ts`, `charts/openbot/README.md`.

**CopilotKit's own pages** (through a fetch tool):

- `https://open.bot/pricing`, `https://open.bot/pricing/tokens`, `https://open.bot/business`, `https://open.bot/builders`, `https://open.bot/legal/trademarks`
- `https://www.copilotkit.ai/pricing`
- `https://www.copilotkit.ai/self-service-agreement` (last updated 2026-08-10)
- `https://copilotkit.ai/legal/developer-edition` (last updated 2026-10-01)
- `https://www.copilotkit.ai/terms-of-service`
- `https://www.copilotkit.ai/blog/introducing-openbot-1-0` (2026-11-10)
- `https://docs.copilotkit.ai/intelligence/self-hosting`, `/intelligence/self-hosting-local`, `/intelligence/managed-intelligence-platform`, `https://docs.copilotkit.ai/concepts/oss-vs-enterprise`
- `https://github.com/CopilotKit/CopilotKit/issues/8283` (opened 2026-11-09 by a member of the public)

**Infrastructure prices:** `https://aws.amazon.com/eks/pricing/`, `https://aws.amazon.com/ec2/instance-types/t3/`.

**Ledger** (`/home/user/LedgerAI/`): `ledger-agent-workspace/AUTOMATION.md`, `ledger-agent-workspace/README.md`, `ledger-agent-workspace/app/mcp/route.ts`, `ledger-agent-workspace/lib/model.ts`, `ledger-client-portal/README.md`, `START-HERE.md`, `GLOSSARY.md`, `docs/adr/0001-software-for-firms-not-a-bookkeeping-service.md`.
