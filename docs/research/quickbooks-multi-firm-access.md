# QuickBooks access for many Firms: what Intuit and Composio require

Research date: 2026-11-14. Every source below was read on that date.

Question: what does Intuit require before many unrelated Firms can connect QuickBooks Online through one paid, self-serve product, can Composio be used for it, and what does each route cost and take? A later addition asks the same about connecting "via MCP", now that the owner has decided the Firm (not the Client) makes the connection.

Each claim carries a key in square brackets, such as [I2] or [C8]. The keys resolve to URLs in [Sources](#sources). Claims marked **(my arithmetic)** or **(my reading)** are mine, not the source's.

## Summary

- **Intuit allows it, but only through an Intuit app that Ledger itself registers.** One product may connect to many unrelated businesses' QuickBooks without being listed in Intuit's app store. Intuit releases the live ("production") keys only after it approves a self-assessment questionnaire. Listing in the app store is optional and adds a three-part review. Intuit's own estimates for the three parts add up to about 45 business days.
- **Intuit charges by usage tier.** The free tier allows 500,000 data-reading calls a month across the whole product and blocks anything above that. The next tier is US$300 a month for 1,000,000. Everything Ledger reads today falls in the metered category. At 50 reads per Client per month, the free tier covers 10,000 Clients (my arithmetic, section 1.5).
- **Intuit replaced its developer terms on 12 November 2026, two days before this research.** The new terms ban using QuickBooks data to train AI, require a written contract with every outside service that sees the data (including the AI model provider), require deletion within 30 days of a disconnect, and require each product to reach data through its own registered Intuit app. A Firm cannot be asked to create Intuit keys and hand them to Ledger.
- **Composio can be used in a paid product, in two ways:** on Composio's own shared Intuit app, or on an Intuit app Ledger registers and plugs into Composio. Composio's own pricing page says its shared apps are "not built for production scale" and to "move to your own app before you scale". QuickBooks is in its most expensive shared-app price band: $0.01 a call against $0.0003 on your own app.
- **Both companies' own words point the same way: Ledger needs its own Intuit app.** Composio then becomes optional plumbing. Keeping it means less to build, but a second company holds the keys and sees the data, and Intuit must be told. Dropping it means Ledger builds key storage to Intuit's security rules. Changing route after Firms have connected means every Client is connected again.
- **The Firm can be the one who connects, but not just anyone at the Firm.** Intuit's help pages say only the firm owner (the firm's primary admin) can connect an app for a client. The approval is given once per Client's books, is tied to the person who gave it, lapses after 100 days without use, and ends after five years at most.
- **"Via MCP" removes none of these requirements.** MCP is a standard way for an AI assistant to call tools. Intuit publishes a developer set-up plugin (no live data), an open-source server that runs for one set of books with your own Intuit app, and a hosted server that is an invitation-only pilot, also on your own Intuit app, with no financial-report tools listed. The QuickBooks connector inside Claude and ChatGPT is for a business's own assistant and is US-only.
- **The main things that could not be verified:** how long Intuit takes to approve the questionnaire, whether Intuit permits a paid product to run on Composio's shared Intuit app, and which Intuit app Ledger's current connection uses. The full list is near the end.

## How Ledger connects today

This is read from the repository, not from a running system.

- The Client portal holds one Composio API key and one Composio "auth config" ID for QuickBooks. Each Client gets a Composio user ID of the form `ledger-client:<account id>` [R1][R3].
- The connect button is in the Client portal, so today the Client clicks it. The portal asks Composio for a hosted sign-in link and sends the Client there [R1].
- Reads go through Composio's tool-execution endpoint, limited to six tools: company info, balance sheet, general ledger, profit and loss, trial balance and transaction list. There are no writes [R2].
- Ledger's agents do not call Composio directly. They call Ledger's own MCP endpoint in the agent workspace, which calls the portal, which calls Composio, which calls Intuit [R4].
- The repository does not show whether the auth config uses Composio's shared Intuit app or an Intuit app the owner registered. The README says only that "OAuth credentials remain with Composio and Intuit" [R3]. This is not verified. It can be checked in the Composio dashboard.

## 1. What Intuit requires

Intuit's developer documentation pages are drawn by JavaScript and could not be read directly. Intuit publishes the same pages as one text file for machine readers [I0], with each page labelled by its address. The quotes below come from that file and are cited to the page they belong to.

### 1.1 Production keys and the app assessment

- A product gets live keys by "publishing" its app. Publishing does not mean listing in the app store. Intuit: "If you want to use your app privately, it's now live and functional", and "You can share the URL with other developers or users so they can access your app, keeping it semi-private" [I1].
- The requirements apply to unlisted apps too: "All apps that connect to production QuickBooks Online companies are expected to comply with Intuit's platform requirements and guidelines. This includes both private (i.e., unlisted) apps and apps that want to be listed on the App Store" [I2].
- Before keys are shown, Intuit wants [I1]:
  - contact details;
  - web addresses for an End User License Agreement and a Privacy Policy;
  - the app's host domain, launch URL, disconnect URL and connect/reconnect URL;
  - up to four categories, any regulated industries, and the regions where the app is hosted;
  - a completed App Assessment Questionnaire.
- The keys stay hidden until Intuit approves the questionnaire: "The Show Credentials switch appears only after the App Assessment Questionnaire is approved" [I1]. The same is stated at [I17].
- The questionnaire is a self-assessment. Intuit says it will ask about complaints, lawsuits and government requests concerning the business, and about past security breaches [I2].
- Two questions bear directly on Ledger:
  - "If you are using another platform to build an integration, you'll be asked to provide information about the other platform and share any instructions they provided to you" [I2]. Composio is such a platform (my reading).
  - "In your app assessment, describe what customer data your app accesses, how it uses that data, whether AI is involved, and which third parties receive data, including AI services" [I13, Q13].
- A material change after approval needs re-approval before it is made. That includes a change to "the third parties to whom User Data is disclosed" [I12, §7.2].
- The app must be "relevant and clearly related to QuickBooks, accounting, payments, workflows, finance, and other acceptable uses" [I2]. Month-end bookkeeping fits (my reading).
- Intuit offers the developer platform only in "Australia, Canada (excluding the Province of Quebec), the United Kingdom, and the United States", plus any others it adds [I12, §17]. Sanctioned countries and persons are excluded [I2].

### 1.2 Listing on the app store

- Listing is optional: "You don't have to list your app" and "if you don't want to list your app to the QuickBooks App Store, you're free to market your app privately and skip the review" [I5].
- A listed app must pass a technical review, a security review and a marketing review [I5][I6].
- Listing needs a paid tier. The Program Guide marks listing "N/A" for the free tier and "Allowed" from Silver [I10, p.16]. The FAQ says a listed app on the free tier "is subject to removal" and "To avoid a delisting, you must subscribe to Silver" [I9].
- To appear inside QuickBooks Online Accountant, where firms browse apps for their clients, a listed app must also support "Sign in with Intuit" and be marked "Accountant ready" [I8].

### 1.3 Ongoing obligations

These apply to every app with live keys, listed or not.

- **Availability.** "All apps must at a minimum be operational and available on a twenty-four-hour, seven days a week. This 24/7 requirement should apply 99.95% of the time" [I2].
- **Support.** The product must give its customers a way to reach it for support [I2].
- **No AI training on the data.** The developer may not "use, or permit any third party to whom you disclose Intuit Content or User Data to use" that data "to train, fine-tune, or otherwise develop any artificial intelligence or machine learning model" [I12, §3.1(e)]. Using AI to do the app's work is allowed: the ban "doesn't by itself prohibit using AI to deliver functionality to your users" [I13, Q4].
- **Written contracts with every outside service that sees the data.** The developer must "bind any processor receiving User Data to written data protection obligations at least as restrictive as this Agreement" [I12, §8.2(d)]. For AI vendors: "A 'training off' setting alone isn't enough because your written agreement with the vendor must include these restrictions" [I13, Q12].
- **Responsibility for those services.** Any act by "any processor, subcontractor, or third-party AI application, assistant, or agent platform" that would breach the data rules "is deemed your own act" [I12, §8.2(h)].
- **Use limits.** Data may be used "solely to provide your Developer Application's functionality" and not sold or shared "except to directly support the User's use of your Developer Application" [I12, §8.2(c)].
- **Deletion.** Data must be deleted, by the developer and by any third party it was shared with, on request or "within thirty (30) days" of a disconnect, of the relationship ending, or of the data no longer being needed [I12, §8.2(f)].
- **Own credentials only.** A developer may not reach data "using any User's individual Developer Account credentials, API keys, client ID, client secret, or OAuth access or refresh tokens, in lieu of your own registered Developer Application", nor ask a User to obtain and hand over such credentials [I12, §3.1(i)]. Intuit's FAQ puts it as: "please access User Data only through your own registered Developer Application and Developer Account" [I13, Q14].
- **Security.** Keys and tokens must be stored securely. The refresh token and company ID must be encrypted [I2][I3]. The security page also says "Intuit OAuth tokens or customer-identifying information is not exposed within your app or shared with other parties", and "Your app does not provide third-parties with access to a customer's QuickBooks data, via external API calls or any other means" [I3]. That page is written for app-store listing, but [I2] tells every app to comply with it.
- **Incidents.** A security incident must be reported to Intuit "no later than twenty-four (24) hours after discovering" it [I12, §9.3].
- **Reviews.** "All apps on our platform will undergo an annual security review" [I2]. The security page is narrower. See [Where sources disagree](#where-sources-disagree).
- **Insurance.** The developer must hold "professional liability, cyber liability, general liability" insurance during the agreement and for three years after [I12, §16.4]. No amounts are given.
- **Intuit's discretion.** Intuit may end access "at any time, for any reason or no reason, with or without notice" [I12, §14.2], and may throttle, limit or block usage without notice [I12, §1.2].
- **If the rules are broken**, Intuit may show warning banners to the app's users, limit new connections, or block the app's calls [I2].

The new terms "apply immediately to new developers" and bind existing developers from 12 December 2026 [I12].

### 1.4 Usage limits

| Limit | Value | Source |
| --- | --- | --- |
| Requests per QuickBooks company | 500 a minute | [I11] |
| Requests per company and app | 10 a second | [I11] |
| Batch requests per company and app | 40 a minute | [I11] |
| After a "too many requests" error (HTTP 429) | Wait 60 seconds | [I11] |
| Metered reads on the free tier | 500,000 a calendar month for the whole workspace, then blocked | [I9][I11] |

- The per-company limits are per Client's books, so Firms do not compete with each other for them (my reading of "per realm ID").
- Higher throttling limits cannot be bought: "Currently, access to higher throttling limits and enhanced API performance is not available" [I9].
- For busy apps, "we may audit and check your app for efficiency, and/or apply additional throttling limits" [I2].

### 1.5 Fees

Every app is enrolled in the Intuit App Partner Program at the free "Builder" tier and cannot opt out [I9]. Fees apply "whether or not your app is published on the Intuit App Marketplace" [I9].

Intuit splits calls into two kinds [I9][I10]:

- **Core**: "most data-in operations such as creating or updating invoices". Unmetered and free.
- **CorePlus**: "most data-out operations such as reading accounts, querying company information, and fetching reports". Metered.

Ledger's six tools are company info and five reports, so all of Ledger's calls are CorePlus (my reading; Intuit's per-endpoint table could not be loaded).

US dollar figures, from the Program Guide dated 03.2026 [I10, p.6 and p.10]. Other regions have different prices [I9].

| | Builder | Silver | Gold | Platinum |
| --- | --- | --- | --- | --- |
| Monthly program fee | No charge | US$300 | US$1,700 | US$4,500 |
| CorePlus calls included each month | 500,000 (hard cap) | 1 million | 10 million | 75 million |
| Price per 1,000 calls, 1M to 10M | Not available | US$3.50 | Included | Included |
| Price per 1,000 calls, 10M to 75M | Not available | US$1.75 | US$1.40 | Included |
| Price per 1,000 calls, above 75M | Not available | US$0.35 | US$0.28 | US$0.25 |
| Minimum active connections | None | None | 500 | 3,000 |
| Payment method on file | No | Yes | Yes | Yes |
| Support | Community forums | Standard support | Standard support | Premium support |

- Only successful production calls are metered. Test ("sandbox") calls and sign-in calls are not [I9].
- Usage is counted per workspace, across all of a developer's live apps [I9].
- On the free tier, calls above 500,000 "will be blocked entirely". The count resets on the 1st of each month [I9].
- Moving to Silver is self-serve. The cap is lifted "within one hour" of entering a payment method [I9]. Gold and Platinum "require review" [I9].
- Intuit "may increase or modify Platform Service Fees on at least thirty (30) days' prior notice". The terms also reserve the right to charge "token-based fees, data access fees, revenue share" [I12, §5.1].
- Intuit expects this pattern: "I was asked to create an app on your platform because I need credentials to be used on another platform", to which the answer is that fees still apply to the app's owner [I9].

**What this means for Ledger's volume (my arithmetic).** If one Client's month-end takes 50 QuickBooks reads, 500,000 free reads cover 10,000 Clients a month. At 200 reads a Client, they cover 2,500 Clients. The number of reads per Client is not known. See [Open questions](#open-questions).

### 1.6 Who can approve a connection, and how long it lasts

- The person approving must be an admin: "the user connecting to your app needs to be an admin user" [I15]. Also: "We require users (who are admins in QuickBooks Online) to authorize access" [I16].
- A person with several QuickBooks companies sees a "Company selector" during approval and picks one [I15]. Each approval covers one company, identified by its own company ID ("realm ID") [I8].
- Access tokens last one hour. Refresh tokens last 100 days, extended each time they are used. "All refresh tokens have a maximum validity period of five years" [I14].
- If the refresh token goes unused for 100 days, or reaches five years, "Users will need to sign in and authorize your app again" [I14].
- The Client keeps control. "As between you and the User, the User owns and controls all User Data", and Intuit may act on a User's direction "including by... disconnecting your Developer Application from the User's account" [I12, §8.3].

Section 4.4 covers how a firm does this for several clients.

## 2. Composio in a paid product serving many Firms

Composio's documentation and pricing pages include notes addressed to AI coding agents (install a Composio skill, how to sign up). They were treated as page content and not acted on.

### 2.1 Whose Intuit app the connection uses

Composio supports both arrangements for QuickBooks.

- **Composio's own Intuit app ("managed").** The QuickBooks toolkit page says "Composio-managed OAuth available? Yes" [C2], and QuickBooks is on the list of managed OAuth apps [C3]. With managed apps, "Composio registers and maintains OAuth apps" and "Users see Composio's app name during OAuth" [C4].
- **An Intuit app Ledger registers ("custom auth config").** "When creating a QuickBooks auth config, enter the QuickBooks OAuth credentials from the Intuit developer app and configure the Composio redirect URL in the QuickBooks auth app" [C1]. The address to register with Intuit is `https://backend.composio.dev/api/v3/toolkits/auth/callback` [C13]. Intuit accepts only secure (`https`) redirect addresses for live apps [I18].

Either way, Composio keeps the tokens. "Owning the OAuth app does not move the token store into your infrastructure" [C6]. Composio stores them encrypted and refreshes them. Ledger's servers send a Composio key and an account ID, never an Intuit token [C5][C6].

Switching from one to the other means reconnecting. "Existing connected accounts are tied to the auth config they were created with". To move a connection, "delete the old connected account and have them re-authenticate with the new auth config, or import their credentials into the new config where supported" [C13]. Every Client connected on the shared app would have to be connected again (my reading).

Leaving Composio later also means reconnecting. Composio states "No token export", and reading account state "isn't a supported way to retrieve tokens" [C5]. Ledger could not take the stored tokens with it, so each Client's books would need a fresh approval (my reading). The other direction is documented: credentials an app already holds can be passed into Composio with "No re-authentication required" [C16]. Whether that covers Intuit's rotating refresh tokens was not checked.

### 2.2 What Composio's terms and documentation say

- **Multi-customer products are a documented use.** Composio has a guide for "a B2B agent [that] serves organizations with multiple members" and recommends one project per environment, with the customer boundary kept in the product's own user IDs [C12].
- **Shared apps are allowed in production.** "Keep them in production when their consent branding, scopes, and shared provider quotas fit your product" [C4]. The production guide says the same [C14].
- **Composio's advice on shared apps is still cautious.** The pricing page: "Works in production, not built for production scale. Move to your own app before you scale" [C8]. The documentation: "Managed apps share quota across all Composio users. Your own app gets a dedicated quota" [C4]. Its rate-limit page names QuickBooks: a "QuickBooks `ThrottleExceeded`" error points to "The Intuit limit named in the full provider response" [C7].
- **Terms of Service (effective 17 October 2026) say nothing about Intuit.** The licence clause is ambiguous about commercial use. See [Where sources disagree](#where-sources-disagree) [C9].
- **Data.** "Composio will not use Payload Data to develop, train, or improve artificial intelligence or machine learning models" [C9, §9]. Payload Data is "retained for up to one year and then automatically deleted" unless Zero Data Retention is on [C9, §9][C10].
- **Data Processing Addendum (updated 17 October 2026).** It repeats the no-training promise and commits to deleting personal data within 30 days after the service ends [C11]. It is not available on the free plan. On Pro an organisation admin accepts it in settings [C8].
- **Per-Firm Intuit apps.** Composio's guide says "If each customer supplies different OAuth credentials, create and manage auth configs programmatically" [C12]. For QuickBooks, Intuit's new terms forbid asking Firms for their own keys [I12, §3.1(i)]. That Composio pattern is closed for Ledger (my reading).

### 2.3 Composio pricing

Platform plans, from the pricing page [C8]. This pricing applies to sign-ups from 15 August 2026. Per-app rates for shared apps apply to sign-ups from 3 November 2026.

| | Hobby | Pro | Enterprise |
| --- | --- | --- | --- |
| Monthly price | $0 | $29, with $29 of usage credit | Custom |
| Tool calls on your own app | 100,000 a month, then stops | 100,000 free, then $0.0003 a call | Custom |
| Tool calls on Composio's shared apps | 20,000 a month (part of the 100,000), then stops | 20,000 free, then by app. **QuickBooks: $0.01 a call** | Custom |
| Connected accounts on your own app | Unlimited, free | Unlimited, free | Custom |
| Connected accounts on shared apps | First 1,000 free | 1,000 free, then $0.10 once each | Custom |
| Calls made outside a "session", as Ledger's are | 10,000 a month free | plus $0.0001 a call | Custom |
| Zero Data Retention | Not included | plus $0.0001 a call | Included |
| Data Processing Addendum | Not included | Included, self-serve | Included |
| Composio's own request limit | 2,000 a minute | 10,000 a minute | Custom |

- The QuickBooks rate of $0.01 was read from the rate data inside the pricing page. The visible table loads separately and showed "Loading managed app rates..." when fetched. Treat the figure as needing a check on the live page.
- Ledger calls Composio's tool-execution endpoint directly, without a session [R2]. Composio prices that as the "direct execution" add-on in the table (my reading).
- **Example at 100,000 QuickBooks reads a month on Pro (my arithmetic).** On the shared app: 80,000 paid calls at $0.01 is $800. On Ledger's own Intuit app: the calls are inside the free 100,000, and the out-of-session add-on is about $9, which the $29 credit covers, so the bill is $29.

### 2.4 Limits that apply through Composio

- Composio's own request limit is per organisation, per minute [C7].
- Intuit's limits still apply underneath. "Unused Composio allowance does not prevent a provider from rejecting a request" [C7].
- On the shared app, Intuit's quotas are shared with every other Composio customer [C4][C7]. "Upgrading your Composio plan alone does not move an existing managed connection to a different provider app or dedicated quota" [C7].
- Which Intuit tier Composio's shared app is on, and so what cap its customers share, is not published. Not verified.

### 2.5 How Intuit's rules bear on using Composio

Sections 2.1 to 2.4 are what Composio says. This section sets Intuit's rules beside them. The conclusions are my reading. Neither company addresses the other by name.

- **On Composio's shared Intuit app, Ledger has no agreement with Intuit.** Composio is the registered developer. Intuit's assessment, its AI disclosures and its data rules would cover Composio's app, and nothing Intuit has approved would describe Ledger's product or its use of AI. Intuit's FAQ asks developers to reach data "only through your own registered Developer Application" [I13, Q14]. Whether Intuit permits a third party to build a paid product on another company's app is not stated in anything read here. Not verified.
- **On Ledger's own Intuit app, Composio is a "processor" under Intuit's terms.** Intuit then requires three things:
  - Composio is disclosed in the assessment [I2];
  - Composio is bound in writing to terms "at least as restrictive" as Intuit's [I12, §8.2(d)]. Composio's Data Processing Addendum is the document that would do this. Whether it is as restrictive as Intuit requires is a legal comparison not made here;
  - QuickBooks data is deleted within 30 days of a disconnect [I12, §8.2(f)]. Composio's default is to keep request and response data for up to a year [C10], so Zero Data Retention or an equivalent setting would be needed.
- **Intuit's security page says tokens are not to be "shared with other parties" [I3].** Its terms, however, plainly expect processors and "agent platforms" to exist [I12, §8.2]. Whether Intuit accepts a platform that stores the tokens is not stated. Not verified. It is the kind of thing the assessment's "another platform" question exists to surface.

## 3. The routes compared

Three routes, because "stay on Composio" covers two different arrangements.

| | A. Composio, on Composio's shared Intuit app | B. Composio, on Ledger's own Intuit app | C. Ledger's own Intuit app, called directly |
| --- | --- | --- | --- |
| Who is the registered developer with Intuit | Composio | Ledger | Ledger |
| Intuit questionnaire and live keys | Not needed by Ledger | Needed [I1] | Needed [I1] |
| Name the Firm sees on Intuit's approval screen | Composio's [C4] | Ledger's [C4] | Ledger's |
| Intuit fees paid by Ledger | None directly | $0 up to 500,000 reads a month, then $300 a month [I10] | Same as B |
| Composio fees | $0 up to 20,000 calls a month. Beyond that, $29 a month plus $0.01 a QuickBooks call [C8] | $0 to $29 a month up to 100,000 calls, then $0.0003 a call [C8] | None |
| Intuit usage cap | Shared with all Composio customers, size unknown [C4][C7] | Ledger's own | Ledger's own |
| Who stores the tokens | Composio [C6] | Composio [C6] | Ledger |
| Outside parties to disclose and contract with | Unclear, since Ledger is not Intuit's developer | Composio and the AI model provider [I12][I13] | The AI model provider [I12][I13] |
| What Ledger must build | Nothing new | Nothing new in code. Intuit paperwork, plus Composio retention settings | Sign-in flow, encrypted token storage and refresh, and the six report calls, to Intuit's security rules [I3] |
| What the supplier says about it | "not built for production scale" [C8] | Composio's recommended path for branding and own quota [C4] | Intuit's standard path [I1] |
| Effect on Clients already connected | None | Each must be reconnected [C13] | Each must be reconnected |
| Changing route later | To B or C: every Client reconnected [C13] | To C: every Client reconnected, because Composio does not export tokens [C5] (my reading) | To B: Composio documents importing existing credentials [C16] |

Engineering effort for route C is not estimated here.

### How long approval takes, according to Intuit

- **Filling in the production app details:** "This should take about 30 minutes to complete" [I1].
- **The questionnaire:** Intuit's documentation gives no review time. See [Not verified](#not-verified-from-a-primary-source).
- **App store listing, if wanted** [I6][I4]. Intuit calls these "estimates only" that "do not constitute a guarantee":
  - first contact to arrange a call: within two business days of submitting;
  - technical review: 10 business days once the developer confirms readiness;
  - security review: up to 30 business days from the start of the scan;
  - marketing review: 5 business days after the security review is approved.
  - Added together that is 45 business days, about nine weeks, before any time spent fixing findings (my arithmetic).
- **Moving from the free tier to Silver:** within one hour [I9].
- **Annual security review of a listed app:** starts about 11 months after it is listed [I7].

## 4. Connecting "via MCP"

MCP (Model Context Protocol) is a standard way for an AI assistant to call tools. It is a way of carrying requests. It does not replace the approval a QuickBooks user gives on Intuit's screen, nor the Intuit app that approval is given to.

### 4.1 What Intuit publishes

Yes, Intuit publishes MCP servers for QuickBooks Online: three offerings for developers and one connector for QuickBooks customers. Each developer offering that touches live data runs on the developer's own Intuit app and keys.

| | Intuit Developer Plugin | QuickBooks Online MCP Server (open source) | Intuit AI Pilot hosted MCP server | QuickBooks connector in Claude and ChatGPT |
| --- | --- | --- | --- | --- |
| Where it lives | Intuit developer docs; installed from Claude's directory [I19] | `github.com/intuit/quickbooks-online-mcp-server` [I21] | `https://mcp.quickbooks.intuit.com/mcp`, described at `github.com/IntuitDeveloper/intuit-3p-ai-pilot` [I22] | Inside Claude.ai and ChatGPT [I23][I24] |
| What it is for | Setting up a developer account, app and test company | Giving one AI assistant access to one QuickBooks company | Letting a partner's AI agent act in QuickBooks | Letting a business use its own QuickBooks from its own assistant |
| Whose Intuit app and keys | The developer's own account. No live keys [I19] | Your own: "You must register an app on the Intuit Developer Portal" [I21] | Your own: "Use your existing Intuit app's `client_id` / `client_secret`" [I22] | None. The customer signs in with their Intuit account [I23] |
| What it exposes | Developer set-up tools only [I19] | 145 tools: create, read, update, delete and search on 29 record types, plus 11 reports [I21] | Customers, products, sales orders, invoices, estimates, payment links and sales settings, read and write. No report tools listed [I22] | Profit and loss, cash flow, benchmarking, importing transactions, invoices, estimates, payment links [I23] |
| Read or write | Neither, on live data | Both. Create, update and delete can each be switched off; reads cannot [I21] | Both [I22] | Both; destructive actions "require your confirmation" [I23] |
| Status | Introduced October 2026 [I20] | Public repository, last commits 15 September 2026 [I21] | "PILOT - By Invitation Only" [I22] | Live, "available to US customers only" [I23] |

More on each:

- **Intuit Developer Plugin.** Intuit lists what it does not do: "Make production API calls", "Generate production keys" and "Replace your compliance review process" [I19]. It is a set-up assistant, not a route to a Firm's data.
- **Open-source server.**
  - It is "a local MCP server. It runs as a stdio subprocess on the developer's or partner's machine and authenticates to a QuickBooks Online company" [I21].
  - One running copy is configured with one Intuit app's ID and secret, one refresh token and one company ID [I21].
  - For live data the Intuit app needs a public secure web address for the approval step [I21].
  - The README adds: "Intuit does not offer per-user API keys. There is no shortcut around the OAuth + app-creation flow" [I21].
  - The repository sits in Intuit's GitHub organisation, but Intuit's developer documentation does not link to it, and the README makes no promise of support.
- **Hosted pilot server.**
  - Its audience is "AI pilot partners under the Intuit App Partner Program" [I22].
  - Joining means giving an assigned Intuit Solution Engineer the product's IP range, its use case, its AI model and its Intuit App ID, which is then "onboarded with MCP scopes" [I22].
  - Intuit "reserves the right to change functionality or charge for any MCP server functionality in the future" [I22].
  - The listed tools are sales-side. None is a balance sheet, general ledger, trial balance or transaction list, which is what Ledger reads [I22][R2].
- **Connector in Claude and ChatGPT.** The customer opens Connectors in Claude, selects QuickBooks, and signs in with "the correct Intuit QuickBooks or Intuit Enterprise Suite user" [I23]. Neither the help article nor Intuit's announcement mentions accounting firms or acting for several clients [I23][I24].

Intuit's terms also define an "Intuit MCP Server": the "server or equivalent direct-access interface made available by Intuit that allows a User to connect their own AI application, assistant, or agent platform directly to their Account, without routing through a Developer's application" [I12, §17]. The terms do not say which of the products above this refers to.

Composio also offers MCP endpoints in front of its toolkits [C15]. They use the same Composio auth config and connected accounts as section 2, so the Intuit app underneath is whichever one that auth config uses (my reading).

### 4.2 Can a hosted product use these for many unrelated Firms?

Not today as a general offering. Only the invitation-only pilot is designed for it.

- **Developer Plugin:** no. It does not touch live data [I19].
- **Open-source server:** it is built for one company per running copy on one machine [I21]. The README notes that "A per-tenant host can also point each connection at its own isolated token file" [I21], so running one copy per Client is technically possible. Nothing in the repository describes or endorses a hosted, many-Firm service. Every copy would still use Ledger's own Intuit app. Having each Firm supply its own Intuit keys is ruled out by [I12, §3.1(i)].
- **Hosted pilot:** yes in design. It is meant for a partner's app, and each company is approved through the normal Intuit sign-in [I22]. In practice it is invitation-only, each product is onboarded by Intuit, and the listed tools do not include the reports Ledger needs [I22].
- **Connector in Claude and ChatGPT:** no. It connects a QuickBooks customer's own assistant to their own books, in the US only [I23]. It is not a route for a third-party product.
- No Intuit document read here says that any MCP route is generally available to a hosted product serving many firms. An Intuit developer-forum thread asks this exact question, but the page could not be opened. See [Not verified](#not-verified-from-a-primary-source).

### 4.3 Does MCP change the production-key and assessment requirements?

No, on the sources read. The same Intuit app and the same approval sit underneath.

- The hosted pilot "uses the same OAuth 2.0 authorization flow as the QuickBooks Online REST API", with "your existing Intuit app's `client_id` / `client_secret`". Token refresh and company selection "work identically to the REST API" [I22].
- The open-source server requires "an app on the Intuit Developer Portal" and, for live data, that app's keys [I21]. Live keys are issued only after the questionnaire is approved [I1].
- The Developer Plugin says: "Production access requires completing the required review and compliance steps in the Intuit Developer Portal" [I19].
- Intuit's terms count the "Intuit MCP Server" among its "Services", and define a "Developer Application" as any product that "uses any of the Services in any capacity" [I12, §17]. The rule that an app must pass "a self-assessment questionnaire" before production [I12, §7.1] therefore covers a product that uses MCP (my reading).
- The data rules name AI routes directly. User Data stays User Data when "held or processed... by any third party acting on your behalf, including a third-party AI application, assistant, or agent platform" [I12, §17].
- The pilot adds requirements: an invitation, an IP allow-list and restricted MCP scopes on top of the standard accounting scope [I22].
- Whether calls made through the hosted MCP server count toward the 500,000 monthly cap is not stated. The pilot's README says only that "no charge is associated with participation in the pilot program" [I22]. The open-source server calls the ordinary API with the app's own keys, so its reads would be metered like any others (my reading).

### 4.4 How a firm authorises an app for each client company

The firm owner approves the app on Intuit's screen, once for each client company.

- **Who at the firm.** QuickBooks help (US, updated 2 November 2026): "for Intuit Accountant Suite (IAS) Firms, only Firm owners can connect and manage apps for a client" [I25]. QuickBooks help (UK): "Only the primary admin and Company Admin can connect and manage apps in QuickBooks Online", and "Accountant Firm Owners (primary admin of the firm) can discover, connect, and manage apps for their clients and firm" [I26]. A staff bookkeeper who is not the firm owner cannot do it, unless that person is a primary or company admin of the Client's own books (my reading).
- **Intuit is moving firms to a new product.** The same page tells firms "still using QuickBooks Online Accountant" to "update to Intuit Accountant Suite (IAS)" [I25].
- **One client at a time.** Intuit's accountant example: "John the accountant has three companies connected to the same Intuit identity: one for his accounting firm, one for Sue's Bakery, and another for Bill's Butcher." An app must keep a separate record per company ID [I8]. During approval the person picks one company from the "Company selector" [I15]. A Firm with 30 Clients goes through the approval 30 times (my reading).
- **From inside QuickBooks, for a listed app.** The firm finds the app, selects "Get app now", then "Select your firm or select a client, then select Install" [I27]. This path exists only for apps listed in the store and marked "Accountant ready" [I8].
- **From the product's own "Connect to QuickBooks" button, for an unlisted app.** The standard approval screen is used [I1][I15]. The pages read do not say outright that a firm owner sees client companies in the selector for an unlisted app. Not verified.
- **The connection belongs to the person who approved it.** Another admin can take it over: "Make sure the app is now associated with your user ID" [I25]. Intuit's error list includes "An accountant user was deleted from a QuickBooks Online company while the company was connected to your app" [I16]. If the firm owner who connected leaves, or the Client removes the firm's access, the connection can break (my reading).
- **Renewal.** The 100-day and five-year limits in section 1.6 apply. A Client with no activity for 100 days must be approved again by the firm owner [I14].

The QuickBooks help quotes in this section were retrieved through a fetch tool that returns excerpts, not the full page text.

## Not verified from a primary source

- **How long Intuit takes to approve the questionnaire.** Intuit's documentation gives no figure. A search excerpt of an Intuit community-forum answer said "2-3 business days"; the page was not opened and the author is unknown.
- **How long the questionnaire takes to fill in.** A search excerpt of Intuit's help article "App assessment and compliance FAQ" [L1] says "approximately 40 minutes". The article itself would not load, and the excerpt suggests it dates from 2022 to 2023.
- **Intuit's regional price table, fee examples and per-endpoint Core/CorePlus list** [L2][L3][L4]. None would load. The fee figures come from the Program Guide PDF [I10] and the FAQ [I9], which agree with each other.
- **Which Intuit app Ledger's current Composio connection uses**, shared or own. Not visible in the repository.
- **Whether Intuit permits a paid third-party product to run on Composio's shared Intuit app**, and which Intuit tier that app is on.
- **Whether Intuit accepts a platform such as Composio storing the tokens**, given the "shared with other parties" wording in [I3].
- **Whether Composio's Data Processing Addendum is "at least as restrictive" as Intuit's terms.** A legal comparison, not made here.
- **Composio's $0.01 QuickBooks rate on shared apps.** Read from data embedded in the pricing page, not from the rendered table.
- **Intuit's October 2025 blog post announcing the open-source MCP server as an "Early Preview"** [L5]. The blog host was unreachable from this session. A search excerpt says the post limited the server to test companies; today's README documents live use.
- **Whether the open-source MCP server is officially supported.** It is in Intuit's GitHub organisation, but nothing read says so.
- **Whether Intuit plans a generally available hosted MCP server for third-party products** [L6]. The forum thread could not be opened.
- **Whether a firm owner sees client companies on the approval screen of an unlisted app.**
- **Whether the hosted pilot's tool list is complete.** The README says "tools like"; the table in it lists no report tools.
- **How much insurance Intuit expects** under [I12, §16.4]. No amounts are given.

## Where sources disagree

- **Composio's licence clause.** One sentence grants use "for both personal and commercial purposes". The next says "This license does not include any resale or commercial use of the platform or its contents" [C9, §3]. Composio's documentation and pricing plainly describe building customer-facing products [C12][C8].
- **Which Intuit apps get an annual security review.** "All apps on our platform will undergo an annual security review" [I2], against "All apps list on the app store, and any app with over 500 connections, will be reviewed by Intuit on an annual basis" [I3].
- **Which Intuit tiers may list in the app store.** The Program Guide says "optional for Silver, Gold and Platinum" [I10]. A footnote in the FAQ says "Marketplace listing is available to Gold and Platinum partners", while the same FAQ tells listed free-tier apps to "subscribe to Silver" [I9].
- **Who may connect an app.** Intuit's developer pages say "an admin user" [I15]. QuickBooks help adds the firm owner and, for firms on the Accountant Suite, says "only Firm owners" [I25][I26].
- **Licence of the open-source MCP server.** The LICENSE file is Apache 2.0. The README and `package.json` say MIT [I21].
- **Whether the open-source MCP server may be used on live data.** The 2025 announcement reportedly said test companies only [L5, unverified]. The current README gives live-data set-up steps [I21].

## What this means for the decision

The decision this feeds is: keep Composio or register Ledger's own Intuit app, and who clicks "connect". The owner has since decided that the Firm connects, and wants the connection made "via MCP".

**Keep Composio or register Ledger's own Intuit app.** These are not alternatives. The evidence separates two questions.

1. *Whose Intuit app?* Everything read points to Ledger's own.
   - Composio says its shared apps are "not built for production scale" [C8].
   - Intuit's new terms expect each product to use "your own registered Developer Application" [I13].
   - Intuit's AI and data rules attach to whoever is registered. On Composio's shared app that is not Ledger.
   - The shared app is the most expensive route per call, and its usage cap is shared with strangers.
   - The shared app remains workable for testing with a handful of Firms.
2. *Keep Composio underneath Ledger's own Intuit app?* This is a real choice.
   - Keeping it (route B) costs little and needs no new code. It adds a company to disclose to Intuit, a contract to accept, and a data-retention setting to change.
   - Dropping it (route C) removes that company. Ledger then builds and operates token storage to Intuit's rules.
   - The choice is not free to reverse. Composio does not export tokens [C5], so leaving it later means every Firm approves every Client again. Moving into Composio later is documented as possible without that [C16].

Both changes of route carry the same cost: every Client connected by then must be connected again [C13][C5]. Settling the route, and registering the Intuit app, before Firms start connecting avoids that.

Whichever route is chosen, three Intuit obligations follow from Ledger being an AI product:

- the AI model provider must be disclosed in the assessment;
- the AI model provider must be bound in writing not to train on the data;
- QuickBooks data must be deleted within 30 days of a disconnect.

**The Firm clicks "connect".** Intuit's rules allow this, with conditions that shape onboarding.

- The person must be the firm owner in Intuit's accountant product, or an admin of the Client's own books. Ledger's onboarding has to say so, and needs a fallback for Firms where the person signing up is not the firm owner.
- It is done once per Client, not once per Firm.
- The connection depends on that person and on the Firm keeping access to the Client's books. It lapses after 100 days without use.
- Today the connect button is in the Client portal [R1]. With the Firm connecting, it moves to the Firm's side.
- Intuit's terms require "clear and accurate disclosures" to Users and that User consent is kept [I12, §8.2(b)]. Whether the Firm's approval on a Client's behalf satisfies that is a question for the Firm's engagement terms and a lawyer. Not answered here.

**"Via MCP".** No MCP route that Intuit publishes changes who must register with Intuit or who must approve.

- The hosted Intuit server is closest to the owner's wish. It is invitation-only, and its listed tools are not the reports Ledger reads.
- The open-source server is for one set of books at a time, on Ledger's own Intuit app.
- The connector in Claude and ChatGPT is not available to a third-party product.
- Ledger's agents already reach QuickBooks data through Ledger's own MCP endpoint [R4], and Composio can also present its tools over MCP [C15]. "Via MCP" can therefore describe how the agents ask for data. The Firm's approval still happens on Intuit's screen, against an Intuit app with live keys.

## Open questions

1. Which Intuit app does the current Composio auth config use: Composio's shared one, or one the owner registered? The Composio dashboard shows this.
2. What does the owner mean by "via MCP": Intuit's hosted MCP server (which needs an invitation and lacks report tools today), or Ledger's agents using an MCP endpoint in front of an ordinary Intuit connection?
3. Should Ledger ask Intuit for a place in the hosted MCP pilot, and will the pilot add report tools?
4. How long does Intuit take to approve the questionnaire? Only Intuit support can say.
5. Will Intuit accept Composio holding the tokens for Ledger's own Intuit app, and how should that be described in the assessment?
6. Does Composio's Data Processing Addendum meet Intuit's "at least as restrictive" test, and does Zero Data Retention cover the way Ledger calls Composio (outside a session, on the older v3 API)?
7. Does Ledger's contract with its AI model provider contain a written no-training commitment that meets Intuit's terms?
8. In which country will the Intuit developer account be registered? This sets the price list and the governing law.
9. Does the firm owner see client companies on the approval screen of an unlisted app, or must the app be listed and "Accountant ready" for firm-led connection to work smoothly? A test with a real firm account would answer this.
10. What happens for Firms that are not on Intuit's accountant product, or whose Clients have not given them accountant access?
11. How many QuickBooks reads does one Client's month-end take? This sizes both Intuit's cap and Composio's bill.
12. Does Ledger want an app-store listing for distribution? It needs a paid tier, about nine weeks of review, and "Sign in with Intuit".
13. Does Ledger hold the insurance Intuit's terms require?

## Sources

All read on 2026-11-14.

### Intuit

| Key | Source | Document's own date |
| --- | --- | --- |
| I0 | Intuit developer docs, full text for machine readers: https://static.developer.intuit.com/v2/llms-full.txt (index: https://static.developer.intuit.com/v2/llms.txt). Used to read I1 to I9 and I11 to I20. | |
| I1 | Publish your app: https://developer.intuit.com/quickbooks-online/docs/go-live/publish-app | |
| I2 | Publishing requirements and guidelines: https://developer.intuit.com/quickbooks-online/docs/go-live/publish-app/platform-requirements | |
| I3 | Security requirements: https://developer.intuit.com/quickbooks-online/docs/go-live/publish-app/security-requirements | |
| I4 | Technical requirements: https://developer.intuit.com/quickbooks-online/docs/go-live/publish-app/technical-requirements | |
| I5 | List your app on our marketplaces: https://developer.intuit.com/quickbooks-online/docs/go-live/list-on-the-app-store | |
| I6 | What to expect during the app review process: https://developer.intuit.com/quickbooks-online/docs/go-live/list-on-the-app-store/what-to-expect-during-the-review | |
| I7 | Learn about the annual compliance review: https://developer.intuit.com/quickbooks-online/docs/go-live/list-on-the-app-store/maintaining-compliance | |
| I8 | Make your app available in QuickBooks Online Accountant: https://developer.intuit.com/quickbooks-online/docs/go-live/list-on-the-app-store/make-your-app-accountant-ready | |
| I9 | Intuit App Partner Program FAQ: https://developer.intuit.com/quickbooks-online/docs/get-started/partner-faq | Last updated 2026-10-02 |
| I10 | Intuit App Partner Program Guide (PDF, 24 pages): https://static.developer.intuit.com/resources/Intuit_App_Partner_Program_Guide.pdf | v1.2_03.2026 |
| I11 | API call limits and throttles: https://developer.intuit.com/quickbooks-online/docs/learn/limits-and-throttles | |
| I12 | Intuit Developer Terms of Service: https://developer.intuit.com/quickbooks-online/docs/legal-agreements/intuit-terms-of-service-for-intuit-developer-services | As of 2026-11-12 |
| I13 | Intuit Developer Terms of Service FAQ: https://developer.intuit.com/quickbooks-online/docs/legal-agreements/intuit-terms-of-service-faq | As of 2026-11-12 |
| I14 | Authorization FAQ (token lifetimes): https://developer.intuit.com/quickbooks-online/docs/develop/authentication-and-authorization/faq | |
| I15 | OAuth troubleshooting (admin user, company selector): https://developer.intuit.com/quickbooks-online/docs/develop/troubleshooting/oauth-errors | |
| I16 | Error codes: https://developer.intuit.com/quickbooks-online/docs/develop/troubleshooting/error-codes | |
| I17 | Get the Client ID and Client Secret for your app: https://developer.intuit.com/quickbooks-online/docs/get-started/get-client-id-and-client-secret | |
| I18 | Set redirect URI: https://developer.intuit.com/quickbooks-online/docs/develop/authentication-and-authorization/set-redirect-uri | |
| I19 | Build with Intuit Developer Plugin, and its sub-pages `what-mcp-can-do`, `mcp-capabilities`, `mcp-plugin-setup`, `troubleshooting`: https://developer.intuit.com/quickbooks-online/docs/get-started/mcp-connector | |
| I20 | QuickBooks Online release notes: https://developer.intuit.com/quickbooks-online/docs/release-notes/general-release-notes | Entries to November 2026 |
| I21 | QuickBooks Online MCP Server repository: https://github.com/intuit/quickbooks-online-mcp-server (README, `.env.example`, LICENSE, `package.json`, commit list) | Latest commits 2026-09-15 |
| I22 | Intuit AI Pilot, Hosted MCP Server (README): https://github.com/IntuitDeveloper/intuit-3p-ai-pilot | |
| I23 | QuickBooks help, "Use Claude to enter transactions and get insights in QuickBooks": https://quickbooks.intuit.com/learn-support/en-us/help-article/accounting-bookkeeping/use-quickbooks-connector-claude/L3YBlo6Ht_US_en_US | Updated 2026-10-28 |
| I24 | Intuit blog, "QuickBooks Expands Into Claude and ChatGPT with New Features": https://www.intuit.com/blog/news-social/quickbooks-expands-into-claude-and-chatgpt-with-new-sales-invoicing-payroll-and-lending-features/ | Published 2026-07-28 |
| I25 | QuickBooks help, "Disconnect an app and change subscription in QuickBooks": https://quickbooks.intuit.com/learn-support/en-us/help-article/accountant-access/disconnect-app-change-subscription/L5y72TDf3_US_en_US | Updated 2026-11-02 |
| I26 | QuickBooks help (UK), "Connect and manage apps in QuickBooks": https://quickbooks.intuit.com/learn-support/en-uk/help-article/mobile-apps/connect-app/L1L5cXGvI_GB_en_GB | "Updated 3 months ago" |
| I27 | QuickBooks help, "Transfer app ownership or disconnect apps": https://quickbooks.intuit.com/learn-support/en-us/help-article/manage-users/transfer-app-ownership-disconnect-apps/L73ZAy899_US_en_US | Updated 2026-08-05 |

How these were read: I1 to I9 and I11 to I20 from Intuit's text file [I0]. I10 as the PDF itself. I21 and I22 from the raw README files and the GitHub pages. I23 to I27 through a fetch tool that returns excerpts, not the full page, so quotes from them are short.

### Composio

| Key | Source | Document's own date |
| --- | --- | --- |
| C1 | QuickBooks configuration guide: https://docs.composio.dev/kb/guide/toolkits-quickbooks | |
| C2 | QuickBooks toolkit page: https://docs.composio.dev/toolkits/quickbooks | Toolkit version 20261101_00 |
| C3 | Managed OAuth apps: https://docs.composio.dev/toolkits/managed-auth | |
| C4 | Managed vs custom auth: https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app | |
| C5 | Authentication: https://docs.composio.dev/docs/authentication | |
| C6 | Token custody architecture: https://docs.composio.dev/docs/security/token-custody | |
| C7 | Rate limits: https://docs.composio.dev/reference/rate-limits | |
| C8 | Platform pricing: https://composio.dev/pricing/platform | Applies to sign-ups from 2026-08-15; per-app shared rates from 2026-11-03 |
| C9 | Terms of Service: https://composio.dev/terms | Effective 2026-10-17 |
| C10 | Data retention and handling: https://docs.composio.dev/docs/security/data-retention | |
| C11 | Data Processing Addendum: https://composio.dev/legal/dpa | Last updated 2026-10-17 |
| C12 | Design a B2B agent with Composio: https://docs.composio.dev/docs/b2b-agents | |
| C13 | White-labeling authentication: https://docs.composio.dev/docs/authentication/white-labeling-authentication | |
| C14 | Move from prototype to production: https://docs.composio.dev/docs/production-readiness | |
| C15 | Sessions via MCP: https://docs.composio.dev/docs/sessions-via-mcp and Single Toolkit MCP: https://docs.composio.dev/docs/single-toolkit-mcp | |
| C16 | Importing existing connections: https://docs.composio.dev/docs/authentication/importing-existing-connections | |

### This repository

| Key | File |
| --- | --- |
| R1 | `ledger-client-portal/app/api/quickbooks/route.ts` |
| R2 | `ledger-client-portal/app/api/accounting/route.ts` |
| R3 | `ledger-client-portal/README.md`, section "QuickBooks authorization contract" |
| R4 | `ledger-agent-workspace/app/mcp/route.ts` and `ledger-agent-workspace/lib/accounting.ts` |

### Leads that could not be opened

These are Intuit's own pages. They were found by search but could not be read, so nothing in this document rests on them except where marked "not verified".

| Key | Page | Why not |
| --- | --- | --- |
| L1 | App assessment and compliance FAQ: https://help.developer.intuit.com/s/article/New-app-assessment-process-FAQ | Page content loads by script |
| L2 | Platform service fees: https://help.developer.intuit.com/s/article/platform-service-fees | Same |
| L3 | API classification for the Intuit App Partner Program: https://help.developer.intuit.com/s/article/API-classification-for-the-Intuit-App-Partner-Program | Same |
| L4 | Partner benefits and regional price table: https://developer.intuit.com/partners/benefits | Same |
| L5 | "Experiment with Intuit's local MCP Server (Early Preview)", 2025-10-21: https://blogs.a.intuit.com/2025/10/21/experiment-with-intuits-local-mcp-server-early-preview/ | Host not reachable from this session; the older blog address redirects to medium.com/intuitdev, which refused the request |
| L6 | Developer-forum question on a hosted, multi-tenant QuickBooks MCP server: https://help.developer.intuit.com/s/question/0D5TR00001LtKZk0AN/ | Page content loads by script |
