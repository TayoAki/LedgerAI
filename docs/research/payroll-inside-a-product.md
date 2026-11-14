# Payroll inside a product: routes, requirements, providers and liability

Researched 2026-11-14. Every source below was opened on that date.

**Question.** What does it take to offer payroll inside a product like Ledger? Which routes exist, what does each require of the product, what do the main providers offer and demand, where does liability for a payroll mistake sit, and what do Firms themselves need in order to run payroll for their Clients?

**Status.** This is research to inform a decision. It is not legal advice. It does not recommend a route. Several points need a lawyer's answer or a provider's written answer before they are relied on; they are listed near the end.

**Assumption.** Firms and their Clients are in the United States. This has not been confirmed with the owner. Everything below is US federal and state material.

**Where Ledger is today.** Read from the repository, not from a running system. Payroll is a role that exists but is switched off. Its scope is "Approved inputs, draft registers and payroll exceptions. Disabled until configured", its schedule is "Disabled · Provider deadlines required", and its tools are "Payroll provider", "Time tracking" and "Secure portal". The code refuses to assign work to it, and the workflow contract says "Scope changes and financial report release remain human. Payroll disabled." The automation notes add: "Financial release uses signed-in human review only. Service calls cannot approve as human." No payroll provider is connected [L1].

Each claim carries a key in square brackets, such as [R5] or [C3]. The keys resolve to URLs in [Sources](#sources).

---

## Plain-language summary

- **There are three ways for a product to offer payroll. They differ mainly in who moves the money and who files the taxes.** (A) *Embedded*: build on a payroll company's "payroll inside your product" service. That company calculates the pay, takes the money from the employer's bank account, pays the workers and files the taxes under its own licences. The product supplies the screens and the first line of support. (B) *Connect*: plug into the payroll company a Firm or Client already uses. That company still runs the payroll; the product reads data and, at most, prepares the inputs. (C) *Run it yourself*: the product does all of it.
- **Whichever route is used, the IRS holds the employer (the Client) responsible for its payroll taxes.** The IRS says a payroll service provider or reporting agent "assumes no liability" for the employer's withholding, reporting, payment or filing duties, and that if the third party fails to pay, "the IRS may assess penalties and interest on the employer's account" [R1][R4]. What a provider owes the employer after a mistake is set by the provider's contract, not by the IRS.
- **Running payroll yourself (C) makes the product a regulated money business.** The state regulators' model money-transmission law says money transmission "includes payroll processing services" [M3]. In December 2025 a national payroll company agreed to pay Texas's banking regulator a $318,750 penalty, without admitting the findings, after the regulator concluded it had processed payroll there without a licence [M6]. States differ: some exempt payroll processors [M4][M5][M7]. Route C also needs IRS approval to file returns electronically (with background checks on the people in charge) [R7], a sponsoring bank, and the bank-transfer network's rules for third parties [M9][M10].
- **In the embedded route (A) the provider carries the licences and the tax filing, but the product must be approved and sign a contract, and no embedded provider publishes its prices.** Gusto says production access needs "commercial, security, and implementation conversations/ reviews" [G1]. Gusto's documentation also says that if an employer's bank payment fails and is not recovered within 90 days, "the liability will be transferred to the partner" [G6]. Check's website says platforms built on it "are not responsible for any credit or fraud losses" [C5]; that is marketing copy, and Check's partner contract is not public.
- **The connect route (B) is narrower than it sounds.** Gusto's partner API can read data and update a payroll's inputs but cannot run a payroll [G12]. Gusto says approval "is not a formality" and lists "early-stage products still establishing a track record" as not currently supported [G11]. Intuit restricts almost all of its QuickBooks payroll API to approved partners [I1]. ADP and Paychex take partners by application [A5][P1]. One connector service, Finch, publishes a price ($65 a month per connected employer) and is read-only at that level [O3].
- **Payroll companies now publish their own AI connectors.** Gusto offers one for employers and one for accountants working across several clients, and says approving a payroll stays a human decision [G19]. Intuit's connector answers payroll questions today and lists running payroll as upcoming [I5]. Check's connector for its partners lists "approve runs" among the actions an AI tool can take [C11]. Whether a third-party product such as Ledger may sit on the other end of Gusto's connector for many Firms was not confirmed.
- **A Firm can already run payroll for its Clients without Ledger holding any payroll relationship.** Gusto, ADP, Intuit, OnPay, Patriot and Paychex each run a programme for accountants. The ones that state a joining cost say it is free [A3][O2][G18]. In these programmes the payroll company stays the filer and the mover of money; the Firm works inside the Client's payroll account. Gusto's accountant terms, read only in excerpts, make the firm responsible for every action taken through its account [G17].
- **What could not be confirmed.** Gusto's legal terms could be read only through search-engine excerpts, because Gusto's website refused automated access. No embedded provider's partner contract, price or minimum is public. ADP's and Paychex's client agreements are not public. No primary source ranks which payroll companies accounting firms use most. The full list is near the end.

---

## How this was checked, and how to read the marks

- IRS documents were downloaded and read as text: the IRS third-party arrangement pages, Publication 15, Revenue Procedure 2012-32, Form 8655 and its instructions, Publication 3112 and the Form 941 instructions. Three IRS pages [R3][R8][R10] were read through a fetch tool that returns short quotations only.
- Federal regulations were read in the official electronic Code of Federal Regulations (eCFR), edition dated 2026-11-01. The model state law, a Delaware regulator's notice, a Texas enforcement order and a Nacha bulletin were downloaded as PDFs and read as text.
- Gusto's and Check's developer documentation was downloaded page by page in the plain-text form those sites publish for machine readers. Check's legal pages were downloaded and read in full. Intuit's developer documentation was read in the single text file Intuit publishes.
- **Gusto's main website refused automated access** (gusto.com, flows.gusto.com, embedded.gusto.com and support.gusto.com all returned "403 Forbidden"). Its legal terms, partner-programme help page, pricing page and AI-connector pages were therefore seen only as excerpts returned by a search engine. Those claims are marked **[Excerpt only]** and should be re-read on the live page before anyone relies on them. Words in quotation marks under that mark are as the search engine returned them and may not match the page word for word.
- Pages on adp.com, paychex.com, intuit.com, onpay.com, patriotsoftware.com, tryfinch.com, salsa.dev, zeal.com, nacha.org and dfpi.ca.gov were read through the fetch tool. Quoted fragments are exact; surrounding sentences are summarised.
- **[Unverified]** marks a claim not confirmed from a primary source.
- **[Sources disagree]** marks a point where sources conflict.
- **[My reading]** marks an inference drawn from the sources, not a statement found in one.
- Ledger's vocabulary is used: a **Firm** is the bookkeeping practice; a **Client** is the business whose books (and payroll) the Firm handles. Where a provider's own word is quoted ("Company", "employer", "customer"), it means the Client unless stated.

---

## 1. The three routes, described plainly

Running a payroll has four parts: work out each worker's pay and deductions; take the money from the employer's bank account and pay the workers; pay the withheld taxes to the tax agencies on time; and file the tax returns and year-end forms. The routes differ in who does the last three.

**Route A. Embedded payroll.** A payroll company offers its whole service for other software to build on. Gusto describes the split this way: "You create the frontend, or leverage our pre-built whitelabled flows, and we'll take care of the backend, from calculating payrolls to filing taxes and ensuring your customers' employees are paid on time", and partners "own the entire user experience, meaning users never have to come to Gusto.com to run payroll" [G12]. Check says: "We handle the intricacies of taxes, money movement, and the production and filing of tax forms" [C13]. The Client still signs the payroll company's own terms and tax authorisations (section 4).

**Route B. Connect to the provider a Firm or Client already uses.** The Client keeps its existing payroll company. The product gets permission to reach that account through the payroll company's partner API. Gusto describes this kind of integration as "complimentary to Gusto's native web application, allowing you to push data to, pull data from, and update data in our system", with users "using both our and your product in concert" [G12]. This route has two variants found during the research:

- *B1, the product's own partner connection*: Ledger registers as a partner with each payroll company and is approved by it.
- *B2, the Firm's own access*: the Firm joins the payroll company's accountant programme and works in each Client's payroll account itself, by hand or through the payroll company's own AI connector. Ledger holds no payroll relationship (sections 5.7 and 9).

**Route C. Run payroll itself.** The product calculates pay, pulls and pays out the money, deposits the taxes and files the returns under an IRS authorisation from each Client. Section 6 lists what that requires.

Two further arrangements exist in IRS guidance, in which the third party takes on tax liability: an agent appointed under section 3504 of the tax code, who "agrees to assume liability along with the employer", and an IRS-certified professional employer organisation, which pays the wages itself [R1]. Both file under their own tax number and are a different kind of business from software. They are not researched further here.

---

## 2. What the IRS says, whichever route is chosen

### 2.1 The employer stays responsible

- The IRS names four common third-party arrangements: payroll service provider, reporting agent, section 3504 agent, and certified professional employer organisation [R1].
- **Payroll service provider (PSP).** "An employer's use of a PSP does not relieve the employer from its responsibility of ensuring that all of its federal employment tax duties are met. A PSP assumes no liability for their employer/clients' employment tax withholding, reporting, payment, and/or filing duties" [R1].
- **Reporting agent.** "Generally, a reporting agent is a PSP that is authorized to perform certain acts" for its clients; the employer names it on Form 8655. "A reporting agent assumes no liability for their employer/clients' employment tax withholding, reporting, payment, and/or filing duties" [R1]. A second IRS page: "These types of third party payers do not assume any of the employer's employment tax liability" [R2].
- **What that means in money.** Publication 15, the employer's tax guide: "The employer remains responsible for federal tax deposits and other federal tax payments even though the employer may forward the tax amounts to the third-party payer to make the deposits and payments. If the third party fails to make the deposits and payments, the IRS may assess penalties and interest on the employer's account. As the employer, you may be liable for all taxes, penalties, and interest due. The employer may also be held personally liable for certain unpaid federal taxes" [R4].
- **Where liability does move.** A section 3504 agent "agrees to assume liability along with the employer" and the IRS "can seek to collect any unpaid employment taxes from both" [R1]. For a certified professional employer organisation, the IRS chart says it is "generally" solely liable for the taxes on wages it pays [R3].
- **People inside a payroll provider can be pursued personally in some cases.** The IRS's internal manual lists "Responsible parties within a PSP" among those who may be liable for the trust fund recovery penalty when withheld taxes are not paid over, depending on the facts [R8]. Read through the fetch tool only.

### 2.2 What a reporting agent is and must do

A reporting agent is the party the IRS lets sign and file an employer's payroll tax returns and make its tax deposits. Every embedded provider read here acts as the reporting agent for the Clients on it (section 4). In Route C, Ledger would have to be one.

- **Who can be one.** "A Reporting Agent is an accounting service, franchiser, bank, service bureau, or other entity authorized to perform on behalf of a taxpayer one or more of the acts described in this revenue procedure" [R5, §4.01]. The IRS e-file guide adds: "Reporting Agents (RAs) are companies (not individuals) that perform payroll services for other businesses" [R7].
- **Authorisation, one per employer.** The employer signs Form 8655. "A separate Authorization must be submitted for each taxpayer on the Agent's List", and "The Service must accept the Authorization and Agent's List before the Reporting Agent may file a return on behalf of a taxpayer" [R5, §4.03, §5.03].
- **Electronic filing and payment are required.** "Reporting agents must file returns electronically except as provided under Rev. Proc. 2012-32", and "must make deposits and payments electronically, generally through the Electronic Federal Tax Payment System (EFTPS)" [R6].
- **An IRS e-file application, with checks on the people.** A reporting agent is one of the IRS's "Authorized IRS e-file Provider" types. During the application "the IRS conducts a suitability check on the firm and on all Principals and Responsible Officials", which may include "A tax compliance check", "A check for prior non-compliance with IRS e-file requirements" and "A criminal background check". New principals "must be fingerprinted using the IRS Authorized Vendor unless they provide professional credentials". "Communication testing is a requirement for Reporting Agents and Transmitters planning to transmit electronic returns to the IRS" [R7].
- **A written warning to every client, at the start and every quarter.** The reporting agent must tell the employer that it remains responsible for filing and paying on time, that authorising an agent "does not relieve the taxpayer from any liabilities resulting from the Reporting Agent's failure to perform", and that it should enrol in EFTPS to check that deposits are being made. This must be given "when it enters into a contract for services with the taxpayer and on at least a quarterly basis" [R5, §5.05].
- **Copies and records.** The agent "must provide the taxpayer with a complete copy of any returns filed", and must keep each authorisation available for IRS inspection until the assessment period for the last return expires [R5, §5.09, §5.10].
- **Limits.** The authorisation does not let the agent ask for penalties to be removed or otherwise represent the employer before the IRS [R5, §5.01(5)].
- **The IRS can suspend a reporting agent.** Rev. Proc. 2012-32 has sections on suspension, review and appeal [R5, §§8 to 11]. They were not read in detail.

### 2.3 A payroll service provider that is not a reporting agent

The IRS's arrangement chart shows no authorisation form for a plain payroll service provider: it prepares returns that the employer signs [R1][R3]. A Firm that prepares payroll inside a payroll company's system, where that company holds the Form 8655, is not itself the reporting agent **[My reading]**. A paid preparer of Form 941 who is not a reporting agent must sign the return and give a preparer tax identification number (PTIN); a reporting agent with a valid Form 8655 generally does not complete that section unless it "offered legal advice, for example, advising the client on determining whether its workers are employees or independent contractors" [R9].

---

## 3. Who may hold and move the money

Payroll money usually passes through the provider: it pulls one amount from the employer's bank account, then pays workers and tax agencies from its own account. Nacha, which writes the rules for the US bank-transfer network (ACH), describes "two separate types of transactions: 1) a 'funding' transaction, whereby the Payroll Processor obtains the funds from the Employer", and "2) the actual payroll payments" [M9]. Holding other people's money in between is what the rules below regulate.

### 3.1 Federal

- A "money transmitter" is "A person that provides money transmission services", meaning "the acceptance of currency, funds, or other value that substitutes for currency from one person and the transmission of currency, funds, or other value that substitutes for currency to another location or person by any means". "Whether a person is a money transmitter as described in this section is a matter of facts and circumstances." One exclusion is a person who only "Accepts and transmits funds only integral to the sale of goods or the provision of services, other than money transmission services" [M1].
- A money services business "(whether or not licensed as a money services business by any State) must register with FinCEN" and "shall develop, implement, and maintain an effective anti-money laundering program", in writing [M2].
- No FinCEN ruling specific to payroll processing was found in a search of fincen.gov. Whether a payroll processor is a federal money transmitter was not settled from a primary source **[Unverified]**.
- What the market does: Check's licensed company "is a FinCEN registered money services business" [C2].

### 3.2 States

- **The model law names payroll.** The Conference of State Bank Supervisors' model Money Transmission Modernization Act defines money transmission and adds: "The term includes payroll processing services." Payroll processing services means "receiving money for transmission pursuant to a contract with a person to deliver wages or salaries, make payment of payroll taxes to state and federal agencies, [make payments relating to employee benefit plans], or make distributions of other authorized deductions from wages or salaries", and does not include "an employer performing payroll processing services on its own behalf" [M3, §2.01(q), (x)].
- **What a licence requires under the model law.** A tangible net worth "of the greater of $100,000 or 3 percent of total assets for the first $100 million", and a surety bond of "the greater of [$100,000] or an amount equal to one hundred percent of the licensee's average daily money transmission liability in this state", up to a bracketed maximum of $500,000. Bracketed figures are for each state to set [M3, §10.01, §10.02]. A licensed payroll processor must "Issue reports to clients detailing client payroll obligations in advance of the payroll funds being deducted from an account" and "Make available worker paystubs" [M3, §9.05].
- **States have enacted it unevenly, and differ on payroll.** The supervisors' August 2026 tracker lists enactments, in full or in part, across more than 30 states since 2022 (my count of the list). On payroll it records, among others: Minnesota "Exempts payroll processing payroll providers"; Nevada "Exempts persons engaged in payroll processing services"; Iowa a "limited exemption for payroll processors"; Maryland an exemption for "agents of the payor that provide payroll processing services" from 1 October 2026; Nebraska an exemption for a payroll processor that "employs less than 20 employees or provides payroll services for less than 50 employees residing in Nebraska"; Georgia provisions that include "payroll processing"; and two competing 2026 Michigan bills, one "including payroll processors" and one "exempting payroll processors" [M4].
- **Texas enforces it.** In a consent order signed 10 December 2025, the Texas Banking Commissioner found that Paylocity "receives money from employer-clients and then distributes those funds to applicable employee and taxing authority accounts", concluded that it "has been conducting money transmission by providing payroll processing services in a manner in which the company receives funds and then distributes them at a later time and to a different location", and ordered it to pay "$318,750.00 to the Department as an administrative penalty" and to file a licence application within 60 days. Paylocity neither admitted nor denied the findings [M6]. The search that found this order also returned Texas orders against two smaller payroll processors (orders 2024-036 and 2026-008); those were not opened **[Unverified]**.
- **Delaware will exempt payroll processors that act as the employer's agent.** Its new law, signed 6 July 2026 and taking effect within a year, exempts "A person designated as an agent of a payor for the purpose of providing payroll processing services" if there is a written agreement, the employer holds the processor out as acting for it, and the employer's "obligation to a payee ... is not extinguished if the agent (payroll processor) fails to deliver funds to employees" [M5]. In plain words: the exemption applies only where the employer still owes the wages if the processor loses the money.
- **California exempts payroll.** A California regulator's letter of 24 April 2020 quotes Financial Code section 2010(j) as exempting "A person that delivers wages or salaries on behalf of employers to employees" or that "facilitates the payment of payroll taxes to state and federal agencies". The exemption does not cover such a person to the extent it "offers money transmission services" or "provides stored value cards directly to individual customers" [M7]. Read through the fetch tool, which returns fragments; the statute itself was not opened.
- **Maine licenses payroll processors under a separate law** (Title 10, chapter 222), with a yearly licence and a surety bond. Seen only as search-engine excerpts of the statute and Maine tax instructions **[Unverified]** [M8].
- **What the embedded providers hold.** Check Payments LLC "maintains money transmitter licenses in the states listed below" (40 states and the District of Columbia, my count) and "In all other U.S. states, Check operates under statutory or regulatory exemptions from licensing requirements" [C2]. Gusto's documentation says "Processing payroll requires a Money Transmitter License (MTL)" and "The licensee for the MTL is Gusto" [G5]. Gusto's marketing site says it is licensed in all 50 states, the District of Columbia and Puerto Rico and that embedded partners need no licence of their own **[Excerpt only]** [G21].

### 3.3 The bank-transfer network's rules

- When a payroll processor moves money through its own bank agreement, Nacha treats the employer as the "Originator" of the wage payments and the processor as, "at a minimum", a "Third-Party Service Provider"; it is a "Third-Party Sender" if it, and not the employer, holds the agreement with the originating bank [M9].
- Since 30 September 2022 a Third-Party Sender "must complete a Risk Assessment of its ACH activities" and "cannot rely on a Rules Compliance Audit or a Risk Assessment completed by another TPS in a chain". The originating bank must register its Third-Party Senders with Nacha [M10]. Read through the fetch tool only.
- Check's terms show how this lands on the Client: "You acknowledge that You are the Originator (as defined in the NACHA Rules) of each Entry and assume the responsibilities and liabilities of an Originator", and Check acts "as a Third-Party Sender" [C3, §6].

---

## 4. Route A in detail: embedded payroll

### 4.1 What the provider does

- **Tax filing as the IRS reporting agent.** Gusto: a new Client must complete "the Direct Deposit Authorization and Form 8655 at minimum, plus any State-specific authorization forms" [G4]. Check: completing a Client's set-up "requires Check to perform some operational steps, like completing a KYB analysis of the company, and filing Form 8655 with the IRS" [C7]. (KYB, "know your business", is an identity and risk check on the Client.) Check's Client-facing terms: "You will authorize Check to act as Your Reporting Agent with the Internal Revenue Service by signing the IRS Form 8655" [C3, §1.3].
- **Money movement under the provider's licence.** Gusto "will initiate up to 4 separate debit transactions from a company's bank account after each payroll is submitted": net pay, reimbursements, taxes, and child support [G3]. Check holds the money "in accounts at state- or federally-insured financial institutions ... until such time as those payments are due" and "no interest will be paid to You on these amounts" [C3, §5.2].
- **Risk review of each Client.** Gusto: "Gusto's Risk team then reviews the company — this can take up to 2 business days though auto-approval can happen in as little as 15 minutes" [G4]. Check: a Client "in review by Check ... pending our approval will be moved to `completed` within two business days" [C7].
- **Scope.** Gusto: "regular payroll runs, off-cycle payments, termination processing, and all associated federal, state, and local filings and payments" [G2]. Check: production "restricts operations to a specific set of ~50 supported states" [C12].

### 4.2 What the product must do

- **Be approved and sign a contract.** Gusto: "Gusto Embedded is not able to support all partner use cases at this time. There are commercial, security, and implementation conversations/ reviews required before partners can move to production." It asks developers "to discuss pre-approval before getting too deep into your build" [G1]. Check's site offers only "Talk to our team" and "Request your API key"; its page for startups measures the time "To go from signature to live customers running payroll", which implies a signed contract comes first [C1][C6][C13]. Some Check features "depend on your contract" or "require a contract amendment" [C12].
- **Put the provider's terms in front of each Client and record acceptance.** Gusto: "Each company added must accept the Terms of Service", and "the user must explicitly accept via a checkbox or button" [G4]. The Client's contract for payroll is with the provider, separately from anything it has with the product: Check's terms say the Client is "purchasing the Payroll Services through Your service provider, which in turn pays fees to Check", that "Check is a separate business entity from Your service provider", and that the service provider is "a third-party beneficiary of these terms" [C3].
- **Name a signatory at the Client.** Gusto: "The signatory must be an officer, owner, general partner, LLC member manager, plan administrator, fiduciary, or authorized representative designated to sign on the company's behalf." If identity verification is skipped, Form 8655 "requires wet signature" [G4]. Check lets a partner collect signatures in its own screens only after "completion of a product review and acceptance of additional terms and conditions", and then "the signing partner is responsible for presenting the correct, current version of each agreement to the appropriate signer and collecting affirmative consent" [C9].
- **Show required documents.** Gusto: "Providing access to Payroll Receipts is a **required** step. All partners must implement Payroll Receipts." The receipt must show "Licensee information (The licensee is Gusto)" and links to "license details, right to refund and liability information" [G5].
- **Pass on urgent notices.** Gusto partners use a notification system "to inform end users of critical payroll-related events", including whether "the issue blocks payroll" [G8].
- **Give first-line support.** Check: "We provide technology, enablement, and operational expertise to empower your support team" [C6]. ADP's comparison page says of Check that "Partners carry more compliance and operational responsibility" [A1]; that is a competitor's description.
- **Chase failed bank payments (Gusto).** "Once a recovery case is created, it is the responsibility of the partner to make sure the client has resolved the issue with the bank and to initiate the redebit within 90 days. After 90 days, the liability will be transferred to the partner." Gusto also tells partners: "once you are on the hook for the funds you should evaluate and decide the level of risk you would like to take on" [G6][G7].
- **Pay the provider.** Gusto bills the partner on "active companies", meaning a Client that has "run payroll or created contractor payments" [G10]. Check publishes a Usage API so the partner can see "which companies, employees, and contractors should be billable in a month" and "pass-through fees generated from failed fundings or wires" [C10]. Neither publishes the amounts. If Ledger is free at launch, these charges fall on Ledger **[My reading]**.

### 4.3 The embedded providers

How they were chosen is in section 10.

| Provider | Can a small new product sign up? | Published price and minimums | Approval process | What it says about risk and licences |
|---|---|---|---|---|
| **Gusto Embedded** | Anyone can use the demo environment. Production needs pre-approval; Gusto "is not able to support all partner use cases at this time" [G1] | Not published. Described on Gusto's site as usage-based **[Excerpt only]** [G21]. Billed per active Client [G10] | "commercial, security, and implementation conversations/ reviews" with the Partnerships team [G1][G11] | Gusto is the licensee [G5]. Failed-debit liability passes to the partner after 90 days [G6] |
| **Check** | No public eligibility rule. Has a page aimed at startups. Contact sales [C1][C6] | Not published. Billed per Client, employee and contractor per month, plus pass-through fees [C10] | Not published. Contract, then build; per-Client KYB review once live [C6][C7] | "Platforms built on us are not responsible for any credit or fraud losses, period" (marketing) [C5]. Licensed in 40 states and DC, exempt elsewhere [C2] |
| **ADP Embedded Payroll** | By application. ADP's developer guide is reported to describe it as for partners with no payroll system of their own, and its partner programme as looking for "a substantial number of shared clients" **[Unverified, search excerpt]** [A7] | Not published | ADP Marketplace partners: application reviewed "by our Sales, Security, and Legal teams", a security questionnaire, then a signed "Developer Participation Agreement" [A5] | "lets platforms offer payroll without becoming payroll processors". Built on "RUN Powered by ADP". ADP provides "Dedicated service teams providing expert support to end-customers" [A1][A2] |
| **Salsa** | "Reach out to us" for API tokens [O4] | Not published | Not published | Not stated on the pages read |
| **Zeal** | "Book a demo" [O5] | Not published | Not published | Run by Puzzl Group Inc.; says it is "not an FDIC insured depository institution" and names banking partners. No licence list found in the part of the legal page that was read [O5] |

ADP's comparison page calls ADP's own product "the most balanced" and lists Gusto's as a "Narrower set of APIs" [A1]. It is a sales page and is used here only as a list of who ADP regards as its competitors.

### 4.4 Who approves a payroll run in the embedded route

- Gusto: "Once the payroll admin reviews employee pay and employer cost and submits the payroll, money moves from the company's bank account to employees and tax agencies. After this point, canceling payroll becomes much more complicated" [G3]. "We recommend building a UI where the user can review their payroll before submitting" [G8]. The submit call is made by the partner's software using a token for that one Client [G9].
- Check's Client-facing terms: "You must approve and submit Payroll Information"; "By allowing Check to submit each payroll, You agree ... (i) You approve all Payroll Information"; "You are responsible for reviewing and verifying Payment Orders for accuracy"; and Check "will use reasonable efforts to verify that anyone providing an instruction to approve, release, cancel, or amend the Payroll Information ... is authorized to do so" [C3, §§2 to 3]. In Check's API the partner's software calls "approve" once "the payroll has been reviewed and is accurate" [C8].
- So the provider's contract treats the Client as the approver, while the technical act of approving is a call made by the partner's software. Neither provider's public terms say whether an accountant at a Firm, or an AI agent, may be the one who approves on the Client's behalf **[My reading]**.
- Deadlines are fixed by the provider. Gusto: "payroll must be submitted four business days before the check date" on the standard schedule, "by 4 PM PST each business day", and "A payroll cannot be canceled after 3:30pm PST on the `payroll_deadline`" [G3][G8]. Check's standard is also four business days [C3, §7].

---

## 5. Route B in detail: connecting to the provider already in use

### 5.1 Gusto (App Integrations)

- **Who may use the API.** "The Gusto API is currently restricted to Gusto App Integration and Embedded Payroll partners." A Gusto customer wanting to connect its own systems is told to "use the Gusto CLI or Gusto MCP server" instead [G11].
- **What it can do.** Update a payroll: yes. Run or process a payroll: no. Onboard a company or employee: no. Pay a contractor: no. Retrieve a paystub or tax form: no [G12]. Typical uses: "Pushing hours and earnings data to Gusto payrolls" and "Pulling payroll data into an insights & analytics platform" [G12].
- **Approval.** "Production access is gated, and not all applications are approved. Production Pre-Approval is not a formality." Without approval Gusto "cannot provide implementation support, QA review, or issue production keys". A good fit is "a software product serving businesses, building an integration for customers you and Gusto share"; "Not currently supported" includes "Early-stage products still establishing a track record of serving small businesses" [G11].
- **Security review.** Applicants should be ready to provide "SOC 2 Type 2, ISO 27001 + SOA, PCI DSS etc.", "Penetration test report(s)" and named security contacts. Without a formal audit, Gusto asks for information on 28 listed topics (my count), among them multi-factor authentication, encryption at rest and in transit, incident response, vendor management, and data retention and destruction [G13]. The same review applies if the product connects "via one of our approved Unified API partners" [G13].
- **Limits.** Each permission grant covers one Client [G14a]. Scopes are assigned at review and "Any API call made outside of your assigned scope in production will be rejected" [G11]. Gusto's API policy forbids providing access "as part of a service bureau or similar fee-for-service purpose" [G14]. Whether that phrase reaches a product whose agents do payroll preparation for Firms is not clear **[My reading]**.
- **Cost.** No fee for API access is stated in the documentation read.

### 5.2 Intuit (QuickBooks payroll, now "QuickBooks Workforce")

- "The Payroll Compensation resource ... is available to partners in the Silver, Gold, and Platinum tiers." "All other Workforce resources are currently restricted to approved partners only." The Workforce API "is not available in the sandbox environment" [I1]. A June 2024 release note said: "The Payroll API is currently in a closed beta and not open to new developers" [I2].
- The one openly available permission, `payroll.compensation.read`, "Grants read access to pay types", to support time tracking [I1].
- Intuit's paid developer tiers and their prices are covered in `docs/research/quickbooks-multi-firm-access.md` (Silver was US$300 a month when that note was written).
- No public Intuit API was found that lets a third-party product run a QuickBooks payroll.

### 5.3 ADP

- **Partner route.** ADP "will review your app and organization". The application "will be reviewed by our Sales, Security, and Legal teams". Unless fast-tracked, the applicant completes a security questionnaire and supplies policies and data-flow diagrams, and must "review and sign a legal contract with ADP" (a "Developer Participation Agreement" for apps that access ADP data) [A5]. The PDF's text was partly garbled by its fonts; the standard the questionnaire is built on reads as an ISO standard whose number could not be made out.
- **Client route.** "API Central" is a product an ADP client buys to integrate its own systems; the page names template categories that include "payroll input". No price is shown, and the page names only ADP Workforce Now, not the small-business RUN product [A6].
- Whether ADP's partner API lets a product submit a payroll in RUN was not confirmed **[Unverified]**.

### 5.4 Paychex

- "Begin by entering your basic information in our questionnaire." "Our Corporate Partnerships Team will then evaluate your request." "If approved, we will create a Partner application", the partner builds in a sandbox, demos the result for final approval, and receives "a key/secret in the production environment". Each client must then approve the connection inside Paychex Flex [P1].
- Paychex's developer site lists payroll use cases including "check creation" **[Unverified, search excerpt]** [P3]. Fees, eligibility criteria and whether a partner can submit a payroll are not published.

### 5.5 Others

- **Rippling.** Its developer programme is reported to be a closed beta with a waitlist, and its terms to forbid using an API key on behalf of another organisation **[Unverified, search excerpt]** [O6].
- **OnPay and Patriot.** Neither accountant page mentions a public API [O1][O2].

### 5.6 Connector services ("unified APIs")

- Finch sells one connection to many payroll systems. Starter is "$65/month" "per connection", up to 15 connections, 24 providers, employers under 500 employees, read-only. Higher plans are "Contact us" and add writing deductions. No plan is described as running a payroll [O3].
- Using a connector does not remove the payroll company's own review: Gusto requires its pre-approval and security review "Regardless of whether you're integrating with Gusto directly or via one of our approved Unified API partners" [G13].

### 5.7 The payroll companies' own AI connectors

MCP is a standard way for an AI assistant to call another system's tools. Three payroll companies now publish such connectors.

- **Gusto, for employers and for accountants [Excerpt only].** Gusto's site describes an official connector at `mcp.api.gusto.com` that a Gusto admin adds to an assistant such as Claude or ChatGPT and signs into with an existing Gusto account. Excerpts say running payroll is possible, that the assistant assembles the run, that "every write comes back to you for confirmation", and that approving payroll "stays a human call, every time". A "multi-client MCP" lets an accountant "connect once and choose the clients to include", with every change returned to the accountant "to review and approve"; Gusto says it is available to all accountant firms. Excerpts of Gusto's connector terms say that connecting to a model provider outside an approved list may be prohibited [G19]. None of this was read on the live pages.
- **Intuit.** Its connector inside Claude and ChatGPT answers payroll questions (roster, payslip history, deductions, "Am I ready to run payroll?"). Running payroll and managing compensation changes are listed as upcoming. "every action remains reviewable and human-verified." Accounting firms are not mentioned [I5]. The earlier research note found this connector is for a business's own assistant, not a route for a third-party product.
- **Check, for its partners.** "Payroll operations — Create payrolls, add earnings and deductions, preview totals, and approve runs." It can run in "Read-only mode", with categories or single tools switched off, and authenticates with a Check Console login "or with a Check API key if you're running an agent on your own servers" [C11]. This is a tool for a product already under contract with Check, not a way round the contract.

---

## 6. Route C in detail: running payroll itself

What the sources show a product would need, beyond the software to calculate pay and tax.

| Need | What the source says |
|---|---|
| IRS reporting-agent status | An accepted IRS e-file application with suitability checks and fingerprinting of principals; a Form 8655 from every Client, accepted by the IRS before filing; communication testing [R5][R7] |
| Ongoing IRS duties | Electronic filing and EFTPS deposits; a written liability warning to each Client at the start and each quarter; a copy of every return to the Client; records kept for inspection; exposure to suspension [R5][R6] |
| State tax authorisations | State agencies have their own authorisation forms. Check collects "state Power of Attorney / filer and remitter authorization forms" [C9]; Gusto collects "State-specific authorization forms" [G4]. The states' own rules were not researched |
| Tax calculation and filing coverage | Check says it "calculates and files more than 6,000 taxes across 1,000+ jurisdictions" (marketing figure) [C6] |
| Money-transmitter licences | Required for payroll in states that follow the model law without an exemption; net worth and bond minimums; enforcement in Texas [M3][M4][M6]. Exempt in some states [M4][M5][M7] |
| Federal registration | If a money transmitter on the facts: FinCEN registration and a written anti-money-laundering programme [M1][M2] |
| A sponsoring bank | An origination agreement with a bank; Third-Party Sender duties including the product's own risk assessment [M9][M10] |
| Capital at risk | The provider pays workers before knowing the employer's payment has cleared. Gusto's and Check's handling of failed debits (sections 4.2 and 8) shows the exposure |
| Risk checks on each Client | Both embedded providers run identity and risk review before a Client's first payroll [G4][C7] |

No source gives a total cost or timetable for Route C. That is not published anywhere found.

---

## 7. The routes side by side

| | A. Embedded | B. Connect to existing provider | C. Run it yourself |
|---|---|---|---|
| Who calculates pay and tax | Provider [G12][C13] | Existing provider | Ledger |
| Who is the IRS reporting agent | Provider, by Form 8655 from each Client [G4][C3] | Existing provider | Ledger, after IRS e-file acceptance [R7] |
| Who holds and moves the money | Provider, under its licences [G5][C2] | Existing provider | Ledger, through a sponsoring bank [M9] |
| Licences and registrations Ledger needs | None stated by the providers; Gusto's site says partners need none **[Excerpt only]** [G21] | None found | Money-transmitter licences where required; FinCEN registration if applicable; IRS e-file provider status [M1][M3][R7] |
| Agreements Ledger signs | A partner contract (not public) after commercial and security review [G1][A5] | B1: each provider's developer terms after its review [G11][A5][P1]. B2: none | Bank origination agreement; state licence undertakings; Form 8655 with each Client |
| What the Client signs | The provider's payroll terms, bank debit authorisation, Form 8655, state forms [G4][C3][C9] | Nothing new with its payroll company beyond approving the connection [P1] | Ledger's payroll terms and Form 8655 |
| Who approves a run, in the provider's terms | The Client ("You must approve and submit") [C3]; "the payroll admin" [G3] | Whoever has authority in the provider's own system: the Client, or the Firm as its accountant (section 9) | Whatever Ledger's own terms say |
| What Ledger can actually do | Everything, in its own screens [G12] | Gusto: read, and update inputs; not run [G12]. Intuit: read pay types [I1]. Finch: read [O3] | Everything |
| Can a small new product start? | By negotiation; no public criteria [G1][C1] | Gusto lists early-stage products as "not currently supported" [G11]; Finch Starter is self-serve [O3] | Not addressed by any source as a matter of size; the requirements are the barrier |
| Published price | None | Gusto API: none stated. Intuit: paid developer tier. Finch: $65 per connection per month [O3] | None |
| Failed employer payment | Gusto: partner bears it after 90 days [G6]. Check: says the platform does not (marketing) [C5] | Not Ledger's; it is outside the money flow **[My reading]** | Ledger |
| Security review of Ledger | Yes [G1][A5] | Yes for B1 [G13][A5] | By the bank and state regulators **[My reading]** |

---

## 8. Where liability for a mistake sits

### 8.1 The regulators

- **Late or wrong tax deposit or filing.** The IRS looks to the employer in Routes A, B and C alike (section 2.1). In Route C Ledger would be the reporting agent and would "assume no liability" to the IRS, but would have to keep telling each Client so in writing [R1][R5].
- **Operating without a licence.** In Route C the regulator looks to the product: penalties and an order to stop and return funds, as in the Texas order [M6].
- **Lost funds.** Delaware's exemption exists only where the employer still owes the wages if the processor fails to deliver them [M5]. Check's terms tell Clients: "no state or federal agency monitors or assumes any responsibility for Check's financial solvency" [C3, §5.2].

### 8.2 The providers' own terms

**Check (read in full; last updated 3 July 2023) [C3].**

- *Wrong inputs.* "We are not responsible or liable for any errors or inaccuracies in information furnished by You." The Client is "responsible for any losses ... including but not limited to IRS penalties and/or interest ... arising from the failure to timely provide and maintain accurate and complete Payroll Information", and waives claims "arising out of any errors or omissions in the Payroll Information which You have not corrected". "Final responsibility for any audits or assessments rests with You."
- *Check's own tax error.* "Check's sole liability and Your sole remedy for Check's failure to perform the payroll tax portion of the Payroll Services shall be as follows: (i) We will remit the payroll taxes received from You to the appropriate taxing authority; and (ii) We will reimburse You or pay directly to the appropriate taxing authority any penalties resulting from Check's error or omission". The clause names penalties; it does not name interest.
- *The reminder the IRS requires.* "ultimately, You are held responsible by taxing authorities for the timely filing of employment tax returns, the accuracy of those returns, and the timely payment of employment taxes".
- *Cap.* Apart from the duty to remit funds, money rightfully owed, and gross negligence or intentional misconduct, Check's total liability "will not exceed the amounts You have paid to Your service provider for use of the Payroll Services in the six (6) month period" before the claim. If the product is free to the Client, that amount may be nothing **[My reading]**. Check's general Terms of Service carry a six-month cap of the same kind [C4].
- *Money while held.* "we will indemnify and hold You harmless from and against any loss of any portion of the principal amount of the Payroll Funds We cause while holding the funds".
- *Insufficient funds.* Check may "refuse to pay any unremitted payroll taxes ... in which case You will be solely responsible for the payroll tax liability", or pay and then "recoup the funds from You".
- *One state rule written in.* For Indiana businesses, if Check fails to remit withholding taxes when due and the Client did not cause it, Check "shall be responsible for ... any penalties or interest assessed by the Indiana Department of Revenue".
- *Legal decisions stay with the Client.* Minimum wage, overtime, pay frequency and "the classification of a worker as an employee vs. an independent contractor are your sole responsibility".

**Gusto Embedded Payroll Service Agreement [Excerpt only] [G15].** Excerpts (version dated 3 September 2025) say: the Client appoints Gusto as its reporting agent; the Client must provide accurate and complete information; for a "Gusto Error" in remitting taxes or filing returns, Gusto's liability is limited to remitting the taxes and reimbursing the Client or paying the appropriate party; the Client must mitigate; Gusto "may, at its sole discretion", help remove penalties caused by bad data; Gusto is not a fiduciary; and the platform's own liability to the Client "is governed by the separate user agreement" between them. The exact wording and any cap were not read.

**Gusto's direct Payroll Service Terms [Excerpt only] [G16].** Excerpts say the employer is solely responsible for the accuracy, timeliness and completeness of payroll information and that Gusto is not liable for penalties or interest caused by inaccurate information.

**Intuit QuickBooks payroll.** "If you receive an IRS penalty, we'll pay all penalty fees and interest up to $25,000/year", on the Elite plan only, "Terms apply" [I3]. The terms were not read.

**Patriot.** "guaranteed accurate filing of tax forms"; if a Patriot error causes penalties it will "cover the fines and penalties" [O2].

**ADP and Paychex.** Client agreements are not published on the pages found **[Unverified]**.

### 8.3 What this means for a mistake that starts in Ledger

- If Ledger's agent prepares a wrong input (hours, a pay rate, a new hire's withholding) and it is approved and submitted, every provider term read treats that as the Client's information and the Client's loss; the provider's promise covers only the provider's own error **[My reading]** [C3][G15][G16].
- In Route B2, Gusto's accountant terms, in excerpts, make the firm "responsible for all actions and transactions taken through its Firm Account" and have the firm represent that each client authorised it to act as the client's agent **[Excerpt only]** [G17].
- What Ledger would then owe the Firm or Client is decided by Ledger's own terms. No source read assigns liability to a software product that only prepares inputs. Ledger's terms and insurance were outside this research.
- In Route A with Gusto, Ledger additionally carries unrecovered failed bank payments after 90 days [G6].

---

## 9. What accounting Firms themselves need

A Firm can run payroll for its Clients through a payroll company's accountant programme. The payroll company stays the reporting agent and the mover of money. The Firm needs an account in the programme and each Client's authorisation.

| Programme | Cost to the Firm | What the Firm can do | What it requires | Pricing published |
|---|---|---|---|---|
| **Gusto** (accountant partner programme, "Gusto Pro") **[Excerpt only]** [G17][G18][G20] | Free; no minimum number of clients | Adding a client through the partner dashboard gives "full access to your client's payroll account, including the ability to run payroll and view reports" | Firm accepts the Accountant Program Terms; represents each client authorised it; is responsible for actions in the firm account; jointly liable for a client's fees if the firm elects to pay them | Direct plans from $49 a month plus $6 per person; the Firm chooses a volume discount or a revenue share |
| **ADP** [A3][A4] | Accountant Connect: "Did we mention it's free?" | Accountant Connect: "multi-client payroll reporting, onboarding, resources". "ADP RUN for Partners": the Firm processes payroll. Its guide lists four ways of working, from "You provide all payroll services for the client. The client does not have access to RUN" to a referral client who lets the Firm view reports only | Revenue share requires agreeing to "applicable program terms". A client given access must accept a terms-of-service agreement [A4] (guide dated 2020) | Not published. "Earn up to 75% revenue share plus ongoing residuals" for referrals |
| **Intuit QuickBooks** [I4][I3] | None stated; the Firm signs in to QuickBooks Online Accountant or Intuit Accountant Suite | "Run client payroll and see the full picture" | Not listed beyond the accountant product | Yes: $50, $88 or $134 a month plus $7, $13 or $17 per employee. Firm-billed: "ProAdvisors save 30% for the duration". Or "up to 30% revenue share for 12 months" |
| **OnPay** [O1] | Not stated; the Firm's own payroll is free | Run payroll for clients from one dashboard; keep control, delegate to staff, or "hand off payroll duties to your clients" | The partner programme's terms and conditions apply (not read) | "Pricing starts at $55 per month"; discounts of 10% to 20% by client count |
| **Patriot** [O2] | "There are no fees for accountants to partner with Patriot" | "run payroll for your clients" or give clients their own access; free co-branding | "open to USA-based accounting firms only" | Discounts from 5% to 30% by client count |
| **Paychex** (Partner Pro) [P2] | Not stated | One dashboard for shared clients' payroll and HR data; referrals. Running payroll is not described | Registration | Not published |

Points that matter for the decision:

- **The Firm is the party with standing in these programmes.** The Client authorises the Firm; the provider's terms bind the Firm. Ledger appears nowhere in that chain **[My reading]**.
- **Who signs the tax authorisation.** The Client's signatory signs Form 8655 in favour of the payroll company [G4][C3]. The Firm does not become the reporting agent by using the programme **[My reading]** [R1].
- **Who may connect outside software.** For QuickBooks, the earlier research note found that only the firm owner can connect an app for a client. For Gusto's AI connector, excerpts say only admins with full access can authorise it **[Excerpt only]** [G19].
- **A Firm that wanted to file returns itself** would need its own reporting-agent status as in section 2.2, or would sign as a paid preparer [R9]. A Firm that held Client payroll money would face the state rules in section 3.2.
- **State rules aimed at payroll processors as such**, such as Maine's, may reach a Firm that handles payroll funds **[Unverified]** [M8].
- **Professional rules for CPA Firms** (for example independence when a Firm runs payroll for a Client it also audits) were not researched.

---

## 10. How the providers were chosen

- **Embedded providers.** The starting list was the three that ADP's own comparison page treats as the field: ADP Embedded Payroll, Gusto Embedded and Check [A1]. Salsa and Zeal were added because searches for embedded payroll returned them repeatedly and both publish developer documentation. Other names seen in search results and not researched: Nmbr, Worklio, Sage Embedded Services, Everee.
- **Established payroll companies used by accounting firms.** Gusto, ADP, Paychex, Intuit QuickBooks, OnPay and Patriot were chosen because each publishes a programme specifically for accountants. Rippling was checked briefly for its developer programme.
- **No primary source was found that ranks which payroll companies accounting firms actually use.** The selection is a judgement, and the first Firms' own answer would be better evidence **[Unverified]**.

---

## 11. Security and compliance obligations that come with payroll data

- Payroll records contain Social Security numbers, bank account numbers, pay and tax details for individuals. `docs/research/security-and-legal-obligations.md` covers what holding such data triggers (state breach and security laws, the FTC Safeguards Rule question, Intuit's terms). Adding payroll makes those duties certain, not possible **[My reading]**.
- Provider reviews ask for evidence. Gusto: SOC 2 Type 2 or ISO 27001 and a penetration test, or detailed answers on 28 listed topics [G13]. ADP: a security questionnaire, policies and data-flow diagrams, and the review continues: "As your partnership with ADP grows over time, our security team will continue to work with you" [A5].
- Gusto's API policy requires developers to hold credentials "in confidence", to maintain "appropriate security policies and procedures and access control methodologies that are consistent with prevailing industry standards", and to give "written notice to Gusto" of unauthorised access [G14].
- Check exposes a separate "Sensitive Data API" and lets partners restrict what its AI connector can do [C11][C13]. The contents of the Sensitive Data API page were not read.
- In Route C the product would itself hold bank and identity data for every worker, and would owe the anti-money-laundering programme in section 3.1 if it is a money transmitter [M2].

---

## Claims not verified from a primary source

- **All Gusto legal terms**: the Embedded Payroll Service Agreement, Payroll Service Terms, Accountant Program Terms, the connector (MCP) terms and the Developer Terms. Seen as search-engine excerpts only; exact wording, caps and dates not read.
- **Gusto's accountant programme details, Gusto's direct prices, and everything about Gusto's AI connectors**, including the multi-client connector for accountants and the "human call, every time" statement. Search-engine excerpts only.
- **Gusto's statement that it is licensed in all 50 states, DC and Puerto Rico and that partners need no licence.** Excerpt only; Gusto's licence page was not read.
- **Every embedded provider's partner contract, price, minimum and timetable.** Not published.
- **Check's "not responsible for any credit or fraud losses" promise.** Marketing copy; the partner contract was not seen.
- **ADP Embedded Payroll's eligibility criteria and ADP's developer site.** The site is drawn by JavaScript and returned no text; criteria are from a search excerpt.
- **ADP's and Paychex's client agreements and their liability terms.** Not found.
- **What the Paychex and ADP partner APIs can do with a payroll**, including whether a partner can submit one.
- **Rippling's developer programme status and terms.** Search excerpt only.
- **Whether a payroll processor is a money transmitter under federal rules.** No FinCEN ruling on payroll was found; the regulation says it depends on facts and circumstances.
- **The text of state statutes.** Texas Finance Code chapter 152, California Financial Code section 2010 and Maine Title 10 chapter 222 were not opened; they are quoted as regulators quote them, or from excerpts.
- **The two other Texas orders against payroll processors** (2024-036, 2026-008). Not opened.
- **How many states have enacted the model law.** "More than 30" is my count of a tracker that mixes full and partial enactments and some 2026 bills.
- **IRS Internal Revenue Manual 5.1.24, the IRS arrangement chart and the Nacha Third-Party Sender rule page.** Read through a fetch tool; short quotations only.
- **Which payroll companies accounting firms use most.** No primary source.
- **The ISO standard behind ADP's security questionnaire.** Garbled in the PDF text.
- **Zeal's licences and Salsa's terms.** Not found in the parts of their pages that were read.
- **Whether any provider permits an AI agent, rather than a person, to approve a payroll.** No term read addresses it for a third-party product.

## Points on which sources disagree

- **Who bears the loss when an employer's bank payment fails.** Gusto's documentation: the partner, after 90 days [G6]. Check's website: platforms "are not responsible for any credit or fraud losses, period" [C5]. These are two providers' different models, and Check's is a marketing statement.
- **Whether an AI tool may approve a payroll.** Gusto's site, in excerpts: approval "stays a human call, every time" [G19]. Intuit: "every action remains reviewable and human-verified" [I5]. Check's connector lists "approve runs" among the things an AI tool can do [C11], while Check's Client-facing terms say the Client approves and is responsible for reviewing [C3].
- **Whether payroll processing is money transmission.** The model law and Texas: yes [M3][M6]. California, Minnesota and Nevada: exempt. Delaware, Maryland, Iowa and Nebraska: exempt on conditions [M4][M5][M7].
- **How much the partner carries in the embedded route.** ADP says partners offer payroll "without becoming payroll processors" and says of Check that "Partners carry more compliance and operational responsibility" [A1]. Check says "Fully licensed money movement means you don't have to worry about regulations" [C5]. Each is a sales claim.
- **Whether Gusto's API is open to new products.** Its embedded documentation welcomes "any developers that want to work with the demo environment" [G1]; its integration documentation lists early-stage products as "Not currently supported" [G11].

---

## What this means for the decision

The decision this feeds has three parts: what the payroll role in Ledger does at launch, which provider route it builds on, and who approves a payroll run. This section sets out what the facts above allow and what each choice commits Ledger to. It does not choose.

**1. What the payroll role does at launch.** The sources support three distinct meanings of "payroll is in the launch".

- *The role prepares; a person runs the payroll in the provider.* This is what the role's current description says: "Approved inputs, draft registers and payroll exceptions" [L1]. It needs no provider agreement, licence or review. It relies on the Firm's own accountant access (section 9). The cost is that someone re-enters or uploads the inputs, and Ledger sees results only if the Firm brings them back.
- *The role prepares and sends inputs into the provider; a person runs the payroll there.* This is what Gusto's integration API allows ("Update a Payroll": yes; "Run/Process a Payroll": no) [G12]. It needs the provider's approval and security review, which Gusto says is not guaranteed and currently excludes early-stage products [G11][G13]. No lead time is published.
- *Payroll runs inside Ledger.* This is Route A or Route C. In Route A each Client signs the provider's terms and Form 8655, passes the provider's risk review, and Ledger supplies receipts, notices and first-line support (section 4.2). In Route C Ledger takes on everything in section 6.

**2. Which provider route it builds on.** The trade-offs the sources show:

- *Route A* puts the licences, the tax filing and the IRS relationship with a provider. In exchange Ledger needs a negotiated contract with unpublished prices, pays per active Client while charging nothing at launch, passes a security review, and (with Gusto) can end up carrying a failed bank payment. The Client, not the Firm, is the provider's contracting party, which is a different shape from Ledger's current model in which the Firm is the subscriber. Whether an embedded provider will take a small, new, free product is answerable only by asking.
- *Route B1* keeps Clients on the payroll company they already have and keeps Ledger out of the money. In exchange Ledger can read and prepare but not run, needs a separate approval from each payroll company, and covers only the companies that approve it. Finch gives read access without those approvals but at a published per-connection price and still subject to Gusto's review.
- *Route B2* needs nothing from the payroll companies and nothing new from Ledger legally. The Firm carries the provider relationship and, under Gusto's terms as excerpted, the responsibility for what is done in the Client's account. Ledger's part is limited to what it hands the Firm, unless the payroll company's own AI connector can be used with Ledger, which is unconfirmed.
- *Route C* gives full control and carries every requirement in sections 2.2, 3 and 6, with regulators looking directly at Ledger.
- The routes are not exclusive. A product can start with one and add another; changing later means each Client signing new authorisations (Form 8655 names one reporting agent at a time [R5, §5.04]).

**3. Who approves a payroll run.** The facts that bear on it:

- The IRS holds the Client responsible whatever is approved and by whom [R1][R4].
- The provider terms read put approval and review on the Client: "You must approve and submit Payroll Information"; "You are responsible for reviewing and verifying Payment Orders for accuracy" [C3]. Gusto's documentation expects "the payroll admin" to review and submit [G3].
- In the accountant programmes the Firm may run payroll in the Client's account under the Client's authorisation, and takes responsibility for its actions there (section 9).
- Statements by Gusto and Intuit keep approval with a person [G19][I5]. Check's connector makes approval technically available to an AI tool [C11], but Check's Client terms do not shift responsibility when it is used.
- Ledger's own existing rule is that financial release is done by a signed-in human and that service calls cannot approve as a human [L1].
- So the candidates the sources recognise are the Client's authorised person, or the Firm's accountant acting under the Client's authorisation, or both in sequence. An approval made by an agent is not provided for in any term read; if it were built, the technical ability exists in Route A, and the responsibility would still rest where the provider's terms put it, with Ledger's own terms deciding what Ledger owes in turn **[My reading]**.
- Approval has a clock. Gusto's standard is submission four business days before payday by 4 pm Pacific, with cancellation closing at 3:30 pm Pacific on the deadline day [G3][G8]. Ledger's agents currently work at 9 am, 1 pm and 4 pm New York time on weekdays [L1]. Whoever approves must be reachable inside the provider's window.

**Needs a lawyer's or a provider's answer before it is relied on.**

- Whether preparing payroll inputs for Firms, without touching money or filing, puts any licensing or registration duty on Ledger in any state.
- What Ledger's terms should say about payroll errors, and what insurance covers them.
- Whether an agent may be the approver under a given provider's terms, and what a Firm's professional rules say about it.
- The actual partner terms, prices, minimums and failed-payment liability from Gusto, Check and ADP.

---

## Open questions

1. **What does the owner mean by payroll being in the launch?** Preparing inputs for a person to run, sending inputs into a provider, or paying people from inside Ledger. The three have very different requirements (see above).
2. **Are all Firms and Clients in the United States, and in which states?** State coverage, state licensing and state tax authorisations all turn on it.
3. **Which payroll companies do the target Firms use today, and do they already belong to those companies' accountant programmes?** No public ranking was found. A handful of conversations would answer it and would show whether Route B2 already exists in practice.
4. **Would Gusto, Check or ADP accept Ledger now, and on what terms?** Price, minimums, timetable, and who carries a failed bank payment are all unpublished. Gusto's pre-approval form and Check's sales contact are the way to find out.
5. **In an embedded route, who is the provider's customer: the Client or the Firm?** The terms read are written for the employer. Whether a provider supports a Firm operating payroll for many Clients inside a third-party product is not documented.
6. **May Ledger connect to Gusto's AI connector on behalf of Firms?** Gusto's excerpts point employers and accountants to assistants such as Claude and ChatGPT, mention an approved list of model providers, and its API policy bars "service bureau" use. Needs Gusto's answer and a reading of the live terms.
7. **May an AI agent approve a payroll under any provider's terms?** Not addressed for third-party products in anything read.
8. **Does a Firm that only enters payroll for Clients fall under any state's payroll-processor law?** Maine's statute was not read; other states were not searched.
9. **Is a payroll processor a money transmitter under federal rules?** No FinCEN ruling found. Matters only for Route C.
10. **What would Ledger owe a Firm or Client when an agent's error causes a wrong payment or a penalty?** Ledger's terms, limits of liability and insurance were outside this research.
11. **Can Ledger pass a provider security review today?** Gusto and ADP both ask for audit reports or detailed control evidence. Ledger's current controls were not assessed here.
12. **What does payroll at no charge cost Ledger in Route A?** Providers bill per active Client, employee or contractor; the rates are unknown.
13. **State payroll-tax registration for each Client** (getting the Client its state tax account numbers) and the states' own authorisation forms were not researched.
14. **Professional rules for CPA Firms that run payroll for Clients** were not researched.
15. **Year-end forms, garnishments, benefits, workers' compensation and contractor payments** are offered by the embedded providers as extras or built in; what Ledger would need to cover at launch was not scoped.
16. **The Gusto pages that refused automated access should be read by a person**: the Embedded Payroll Service Agreement, the Accountant Program Terms, the connector terms and the licence page.

---

## Sources

All opened 2026-11-14. "Read as" says how each was read; see "How this was checked".

| Key | Source | Link | Date on source; read as |
|---|---|---|---|
| L1 | Ledger repository, `ledger-agent-workspace/lib/model.ts`, lines 9, 27, 28, 41, 44; `ledger-agent-workspace/AUTOMATION.md`, line 17 | (local files) | Read directly |
| R1 | IRS, "Third party arrangements" | https://www.irs.gov/businesses/small-businesses-self-employed/third-party-arrangements | Reviewed 10-Sep-2026; full text |
| R2 | IRS, "Third party payer arrangements – Payroll service providers and reporting agents" | https://www.irs.gov/government-entities/third-party-payer-arrangements-payroll-service-providers-and-reporting-agents | Reviewed 23-Jul-2026; full text |
| R3 | IRS, "Third party arrangement chart" | https://www.irs.gov/businesses/small-businesses-self-employed/third-party-arrangement-chart | Reviewed 30-Jun-2026; fetch tool |
| R4 | IRS Publication 15 (2026), (Circular E), Employer's Tax Guide, "Outsourcing payroll duties" and section 16 | https://www.irs.gov/publications/p15 | 2026 edition; full text |
| R5 | IRS Revenue Procedure 2012-32 | https://www.irs.gov/pub/irs-drop/rp-12-32.pdf | 2012; PDF text |
| R6 | IRS Form 8655, Reporting Agent Authorization, with instructions | https://www.irs.gov/pub/irs-pdf/f8655.pdf | Rev. January 2024; PDF text |
| R7 | IRS Publication 3112, IRS e-file Application and Participation | https://www.irs.gov/pub/irs-pdf/p3112.pdf | Rev. 11-2026; PDF text |
| R8 | IRS Internal Revenue Manual 5.1.24, Third-Party Payer Arrangements for Employment Taxes | https://www.irs.gov/irm/part5/irm_05-001-024r | Reported as revised 20 May 2026; fetch tool |
| R9 | IRS Instructions for Form 941 | https://www.irs.gov/pub/irs-pdf/i941.pdf | Rev. March 2026; PDF text |
| R10 | IRS, "Outsourcing payroll and third-party payers" | https://www.irs.gov/businesses/small-businesses-self-employed/outsourcing-payroll-and-third-party-payers | Reviewed 10-Oct-2026; fetch tool. Background only |
| M1 | 31 CFR 1010.100(ff)(5), definition of money transmitter | https://www.ecfr.gov/current/title-31/section-1010.100 | eCFR edition 2026-11-01; full text |
| M2 | 31 CFR 1022.380 (registration) and 1022.210 (anti-money-laundering programme) | https://www.ecfr.gov/current/title-31/part-1022 | eCFR edition 2026-11-01; full text of the passages quoted |
| M3 | Conference of State Bank Supervisors, model Money Transmission Modernization Act | https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf | File dated 2023-02; PDF text |
| M4 | Conference of State Bank Supervisors, "2022-2026 Money Transmission Modernization Act Proposed and Enacted Legislation (August 2026)" | https://www.csbs.org/mtma-legislative-update-august-2026 | August 2026; PDF text. Headed "Internal Use Only" but published |
| M5 | Delaware Office of the State Bank Commissioner, "Exemption from Money Transmitter Licensure for Certain Payroll Processors" | https://banking.delaware.gov/wp-content/uploads/sites/73/2026/08/Payroll-Processor-Notice-Aug-21-2026.pdf | 20 August 2026; PDF text |
| M6 | Texas Department of Banking, Consent Order No. 2025-026, Paylocity Corporation | https://www.dob.texas.gov/sites/default/files/files/Laws-Regulations/orders/2025-026.pdf | Signed 10 December 2025; PDF text |
| M7 | California Department of Financial Protection and Innovation, opinion letter "MTA – payroll processing" | https://dfpi.ca.gov/rules-enforcement/laws-and-regulations/opinion-letters-by-law-subject/mta-payroll-processing/ | 24 April 2020; fetch tool |
| M8 | Maine Revised Statutes, Title 10, chapter 222 (payroll processors), section 1495-E | https://legislature.maine.gov/statutes/10/title10sec1495-E.html | Search excerpt only; not opened |
| M9 | Nacha, ACH Operations Bulletin #2-2014, "ACH Transactions Involving Third-Party Senders and Other Payment Intermediaries" | https://www.nacha.org/system/files/2023-08/ACH-Operations-Bulletin-2-2014.pdf | 30 December 2014; PDF text |
| M10 | Nacha, "Third-Party Sender Roles and Responsibilities" | https://www.nacha.org/rules/third-party-sender-roles-and-responsibilities | Rule effective 30 September 2022; fetch tool |
| G1 | Gusto Embedded docs, "Introduction" | https://docs.gusto.com/embedded-payroll/docs/introduction | Updated 2026-02-03; full text |
| G2 | Gusto Embedded docs, "Platform overview" | https://docs.gusto.com/embedded-payroll/docs/platform-overview | Updated 2026-05-21; full text |
| G3 | Gusto Embedded docs, "Payroll fundamentals" | https://docs.gusto.com/embedded-payroll/docs/payroll-fundamentals | Updated 2025-12-02; full text |
| G4 | Gusto Embedded docs, "Onboard a company", "Getting started", "Company forms" | https://docs.gusto.com/embedded-payroll/docs/onboard-a-company ; https://docs.gusto.com/embedded-payroll/docs/getting-started ; https://docs.gusto.com/embedded-payroll/docs/company-form | Full text |
| G5 | Gusto Embedded docs, "Payroll Receipts" and "Pay contractors" | https://docs.gusto.com/embedded-payroll/docs/payroll-receipts ; https://docs.gusto.com/embedded-payroll/docs/process-contractor-payments | Full text |
| G6 | Gusto Embedded docs, "Recovery Cases" | https://docs.gusto.com/embedded-payroll/docs/recovery-cases-1 | Updated 2025-12-02; full text |
| G7 | Gusto Embedded docs, "Payroll Processing Speeds" | https://docs.gusto.com/embedded-payroll/docs/2-day-vs-4-day | Full text |
| G8 | Gusto Embedded docs, "Complete a Regular Payroll" and "Partner notifications" | https://docs.gusto.com/embedded-payroll/docs/complete-a-regular-payroll ; https://docs.gusto.com/embedded-payroll/docs/partner-notifications | Full text |
| G9 | Gusto Embedded docs, "Authentication and authorization" | https://docs.gusto.com/embedded-payroll/docs/authentication-and-authorization | Updated 2026-10-29; full text |
| G10 | Gusto Embedded API reference, "Retrieve invoicing data for companies" | https://docs.gusto.com/embedded-payroll/reference/get-invoices-invoice-period | Full text of the description |
| G11 | Gusto App Integrations docs, "Introduction" | https://docs.gusto.com/app-integrations/docs/introduction | Updated 2026-09-29; full text |
| G12 | Gusto App Integrations docs, "App Integrations vs. Gusto Embedded" | https://docs.gusto.com/app-integrations/docs/app-integrations-vs-embedded-payroll | Updated 2025-12-02; full text |
| G13 | Gusto App Integrations docs, "Security Review" | https://docs.gusto.com/app-integrations/docs/security-review | Updated 2026-05-14; full text |
| G14 | Gusto, "API Policy" | https://docs.gusto.com/embedded-payroll/page/api-policy | "Last updated July 11, 2022"; full text |
| G14a | Gusto App Integrations docs, "Strict Access" | https://docs.gusto.com/app-integrations/docs/strict-access | Full text |
| G15 | Gusto, Embedded Payroll Service Agreement | https://flows.gusto.com/terms | Reported as updated 3 September 2025; **search excerpts only** |
| G16 | Gusto, Payroll Service Terms | https://gusto.com/legal/terms/payroll | **Search excerpts only** |
| G17 | Gusto, Accountant Program Terms of Service | https://gusto.com/legal/terms/partners | **Search excerpts only** |
| G18 | Gusto Help Center, "Gusto Partner Program" | https://support.gusto.com/article/178283329081125/gusto-partner-program | **Search excerpts only** |
| G19 | Gusto, "Gusto MCP integration"; "How Gusto Is Helping Accounting Firms Build What's Next"; Help Center, "Connect Gusto to ChatGPT, Claude, and Slack"; "Gusto MCP Terms of Service" | https://gusto.com/product/integrations/gusto-mcp ; https://gusto.com/company-news/introducing-the-new-gusto-pro ; https://support.gusto.com/article/250715155353740/connect-gusto-to-chatgpt-claude-and-slack ; https://gusto.com/legal/terms/gusto-mcp | **Search excerpts only** |
| G20 | Gusto, pricing page | https://gusto.com/product/pricing | **Search excerpts only** |
| G21 | Gusto Embedded marketing pages | https://embedded.gusto.com/solutions/banking-fintech ; https://embedded.gusto.com/partners | **Search excerpts only** |
| C1 | Check, home page | https://www.checkhq.com/ | Fetch tool and page text |
| C2 | Check, "Licenses" | https://www.checkhq.com/company/licenses | Full text |
| C3 | Check, "Check Payroll User Service Terms" | https://www.checkhq.com/company/employerterms | "Last updated July 3, 2023"; full text |
| C4 | Check, Terms of Service | https://www.checkhq.com/company/terms | Last updated 3 September 2021; fetch tool. Background only |
| C5 | Check, "Credit and fraud protection" | https://www.checkhq.com/platform/payroll/credit-and-fraud-protection | Page text |
| C6 | Check, "Support", "Startups" and "Check Core" pages | https://www.checkhq.com/platform/payroll/support ; https://www.checkhq.com/solutions/startups ; https://www.checkhq.com/check-core | Page text |
| C7 | Check docs, "Implementation Status" and "Company Enrollment" | https://docs.checkhq.com/docs/implementation-status ; https://docs.checkhq.com/docs/company-enrollment | Updated 2025-10-12; full text |
| C8 | Check docs, "Payroll Preview and Approval" | https://docs.checkhq.com/docs/payroll-preview-and-approval | Updated 2026-09-25; full text |
| C9 | Check docs, "Signing Forms via the API" | https://docs.checkhq.com/docs/signing-forms-via-api | Updated 2026-08-13; full text |
| C10 | Check docs, "Billing customers" | https://docs.checkhq.com/docs/usage | Updated 2026-03-09; opening section |
| C11 | Check docs, "Check MCP Server" | https://docs.checkhq.com/docs/overview-1 | Updated 2026-09-01; full text |
| C12 | Check docs, "Understanding Sandbox and Production Environments" | https://docs.checkhq.com/docs/understanding-sandbox-and-production-environments | Passages searched |
| C13 | Check docs, "Overview" and documentation index | https://docs.checkhq.com/docs/overview ; https://docs.checkhq.com/llms.txt | Fetch tool; index read |
| A1 | ADP, "Choosing the right embedded payroll partner: ADP vs. Gusto Embedded vs. Check" | https://www.adp.com/resources/articles-and-insights/articles/c/choosing-the-right-embedded-payroll-partner.aspx | Table "As of May 29, 2026"; fetch tool |
| A2 | ADP press release, "ADP Embedded Payroll Gives Partners a Competitive Edge" | https://mediacenter.adp.com/2025-09-29-ADP-R-Embedded-Payroll-Gives-Partners-a-Competitive-Edge-with-Integrated-HCM-Solution | 29 September 2025; fetch tool |
| A3 | ADP, "Payroll & HR for Accountants" | https://www.adp.com/who-we-serve/by-partner/accountants | Fetch tool |
| A4 | ADP, "Getting Started: RUN Powered by ADP Payroll for Partners" | https://support.adp.com/adp_payroll/content/hybrid/@cpa/doc/guides/gettingstarted.pdf | Copyright 2006-2020; PDF text |
| A5 | ADP Marketplace, "Overview: Become a Partner" | https://marketplace.adp.com/downloads/becoming-a-partner.pdf | Undated; PDF text, partly garbled |
| A6 | ADP, "API Central" | https://www.adp.com/what-we-offer/integrations/api-central.aspx | Fetch tool |
| A7 | ADP developer site, partner integration overview and embedded payroll guide | https://developers.adp.com/getting-started/partner-integration-overview | **Search excerpts only**; the page returned no text |
| P1 | Paychex Developer Program, "Partner with us!" | https://developer.paychex.com/partner | Fetch tool |
| P2 | Paychex, "Partner Pro" | https://www.paychex.com/accounting-professionals/partner-pro | Fetch tool |
| P3 | Paychex Developer Program, use cases | https://developer.paychex.com/use_cases | **Search excerpts only** |
| I1 | Intuit developer docs, QuickBooks Workforce "Get started" and scopes | https://developer.intuit.com/quickbooks-workforce/docs/get-started (read in https://static.developer.intuit.com/v2/llms-full.txt) | Full text |
| I2 | Intuit developer release notes, June 2024 | Same text file | Full text |
| I3 | Intuit QuickBooks, payroll pricing | https://quickbooks.intuit.com/payroll/pricing/ | Fetch tool; a promotion was showing |
| I4 | Intuit QuickBooks, payroll for accountants | https://quickbooks.intuit.com/accountants/products-solutions/payroll/ | Fetch tool |
| I5 | Intuit blog, "QuickBooks Expands Into Claude and ChatGPT with New Features" | https://www.intuit.com/blog/news-social/quickbooks-expands-into-claude-and-chatgpt-with-new-sales-invoicing-payroll-and-lending-features/ | 28 July 2026; fetch tool |
| O1 | OnPay, accountants page | https://onpay.com/accountants/ | Fetch tool |
| O2 | Patriot Software, accountants page | https://www.patriotsoftware.com/accountants/ | Fetch tool |
| O3 | Finch, pricing | https://www.tryfinch.com/pricing | Fetch tool |
| O4 | Salsa, home page and docs introduction | https://www.salsa.dev/ ; https://docs.salsa.dev/docs/introduction | Fetch tool |
| O5 | Zeal, home page and legal page | https://www.zeal.com/ ; https://www.zeal.com/legal?tab=licenses | Fetch tool; legal page read in part |
| O6 | Rippling developer documentation | https://developer.rippling.com/ | **Search excerpts only** |
