# Security and legal obligations of holding Firms' Client financial records

Researched 2026-11-14. Every source below was opened on that date.

**Question.** Ledger will hold and process Clients' bank statements, source documents and QuickBooks Online data as a vendor to bookkeeping Firms. What security and legal obligations come with that, which of them must be met before the first Firm's real data goes in, and which are only expected by the market?

**Status.** This is research to inform a decision. It is not legal advice, and several points below need a lawyer's answer before they are relied on.

**Assumption.** Firms are in the United States. This has not been confirmed with the owner. Section 9 says why it matters.

---

## Plain-language summary

- **Two sets of rules bind Ledger from the first real upload, whatever its size.** State laws require a business holding people's names with bank-account or Social Security numbers to keep them reasonably secure and to tell the data's owner (the Firm) at once if there is a breach. Four states' laws were read; the FTC says every state has a breach law. Massachusetts goes further and requires a written security program. Separately, Intuit's developer agreement, which Ledger accepts in order to connect to QuickBooks Online, sets its own security rules, a 24-hour deadline to tell Intuit about a security incident, and deletion on request.
- **The federal rule this market talks about most, the FTC Safeguards Rule, names firms that prepare income tax returns as covered.** A covered Firm must pick vendors able to protect the data, put that duty in the contract, and re-check the vendor from time to time. So Ledger needs a contract and a written description of its security that a Firm can rely on.
- **Whether that rule covers a bookkeeping-only Firm is not settled by any primary source found.** The rule protects information about individuals using a financial service for personal or household purposes. Records of a business Client appear to be outside it. The IRS says "tax and accounting professionals" are covered; the regulation's own example is narrower. Sources disagree.
- **The FTC has said that "data processors" serving covered firms are themselves directly subject to the rule.** Ledger cannot control whether a Firm uploads an individual's records, so the safe plan is to build as if the rule applies to Ledger: a written security program, one named person in charge, encryption, two-step sign-in for everyone, activity logs, a deletion schedule and oversight of Ledger's own suppliers.
- **No law found requires a SOC 2 report.** It is an independent auditor's report that established vendors show to buyers. Five of seven accounting-software security pages checked advertise SOC 2 and a sixth advertises ISO 27001. It is a market expectation and can follow launch. A contract and honest written security claims cannot wait.
- **On AI, no source found forbids running AI models over Client financial data.** What the sources do address: do not use Client data to train models without specific consent; treat the AI model provider as a subcontractor under a written agreement at least as strict as Ledger's own duties; keep a human reviewing the output; and prevent one Client's data from leaking into another's results.
- **If a Firm that prepares tax returns sends Ledger information gathered for a return, federal tax law (section 7216) treats Ledger as a "tax return preparer" for confidentiality purposes,** with criminal penalties for misuse, and requires the taxpayer's consent before that information goes outside the United States. Keeping storage, processing and staff access in the US avoids this problem.
- **The US-only assumption matters.** The UK makes a written data-processing contract a legal requirement and makes the vendor directly liable. Canada holds the Firm responsible for data it sends to a processor. Neither was researched in depth.

---

## How this was checked, and how to read the marks

- Regulations were read in the official electronic Code of Federal Regulations (eCFR) through its public data interface, edition dated 2026-11-01. The eCFR reported itself current to 2026-11-12. Federal Register notices and the US Code were read on govinfo.gov. IRS publications and the AICPA Code were downloaded as PDFs; the passages quoted were read in the documents' own text, and the rest of each document was searched, not read cover to cover.
- Pages on ftc.gov, nysenate.gov and vendor sites were read through a fetch tool that returns short quotations only. Quoted fragments are exact; surrounding sentences are summarised.
- Two official sites refused automated access: California's legislature site and Massachusetts's mass.gov. For those, a republished copy was read and is named where used.
- **[Unverified]** marks a claim not confirmed from a primary source.
- **[Sources disagree]** marks a point where sources conflict.
- **[My reading]** marks an inference drawn from the sources, not a statement found in one.

---

## 1. The FTC Safeguards Rule and the Gramm-Leach-Bliley Act (GLBA)

### 1.1 What it is and who it covers

GLBA requires "financial institutions" to protect customer records. The FTC's Safeguards Rule, 16 CFR Part 314, is the security rule for financial institutions that are not banks or otherwise under another regulator. ([15 U.S.C. 6801(b)](https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap94-subchapI-sec6801.htm); [16 CFR 314.1](https://www.ecfr.gov/current/title-16/part-314))

Three definitions decide coverage. All are from [16 CFR 314.2](https://www.ecfr.gov/current/title-16/section-314.2).

- **Financial institution**: "any institution the business of which is engaging in an activity that is financial in nature or incidental to such financial activities" as listed by the Federal Reserve. The rule's own example for this field is: "An accountant or other tax preparation service that is in the business of completing income tax returns is a financial institution" (314.2(h)(2)(viii)). Entities "not significantly engaged" in a financial activity are excluded (314.2(h)(3)(iv)).
- **Consumer**: "an individual who obtains or has obtained a financial product or service from you that is to be used primarily for personal, family, or household purposes" (314.2(b)(1)).
- **Customer information**: "any record containing nonpublic personal information about a customer of a financial institution ... that is handled or maintained by or on behalf of you" (314.2(d)). A customer is a consumer with a continuing relationship (314.2(c)).

The rule's scope sentence adds that it covers customer information "regardless of whether such information pertains to individuals with whom you have a customer relationship, or pertains to the customers of other financial institutions that have provided such information to you" (314.1(b)).

### 1.2 Is a bookkeeping-only Firm covered?

No primary source found answers this directly. What the sources say:

- The regulation's example names firms "in the business of completing income tax returns". It does not name bookkeeping. ([16 CFR 314.2(h)(2)(viii)](https://www.ecfr.gov/current/title-16/section-314.2))
- The Federal Reserve list that defines "financial activity" includes "Providing tax-planning and tax-preparation services to any person" and, separately, "Providing data processing, data storage and data transmission services ... if: (A) The data to be processed, stored or furnished are financial, banking or economic". It does not use the word bookkeeping. ([12 CFR 225.28(b)(6)(vi) and (b)(14)](https://www.ecfr.gov/current/title-12/section-225.28))
- The FTC's plain-language guide lists "tax preparation firms" and does not mention accountants or bookkeepers. The page is dated December 2024. ([FTC Safeguards Rule: What Your Business Needs to Know](https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know))
- IRS Publication 5708 states it more broadly: "Under the GLBA and Safeguards Rule, tax and accounting professionals are considered financial institutions, regardless of size." ([IRS Pub. 5708, Rev. 8-2024, p. 2](https://www.irs.gov/pub/irs-pdf/p5708.pdf))
- **[Sources disagree]** Trade and training sites found by search say bookkeeping and payroll firms are covered. None cites an FTC statement to that effect. They are leads only and are not relied on here.

Whatever the answer on "financial institution", a second limit applies. The rule protects information about individuals using a service for personal, family or household purposes.

- The FTC wrote when adopting the rule: "the Safeguards Rule only applies to information about a consumer who is a 'customer' of a financial institution". ([67 FR 36484, 36486, May 23, 2002](https://www.govinfo.gov/content/pkg/FR-2002-05-23/html/02-12952.htm))
- The companion privacy rule states it "does not apply to information about companies or about individuals who obtain financial products or services for business, commercial, or agricultural purposes." ([12 CFR 1016.1(b)(1)](https://www.ecfr.gov/current/title-12/section-1016.1))
- The FTC's privacy guide says: "The term 'consumer' does not apply to commercial clients, like sole proprietorships." The guide is dated July 2002 and cites the older rule number. ([FTC, How To Comply with the Privacy of Consumer Financial Information Rule](https://www.ftc.gov/business-guidance/resources/how-comply-privacy-consumer-financial-information-rule-gramm-leach-bliley-act))

**[My reading]** Ledger's glossary defines a Client as a business. Books kept for a business Client are not "customer information" under this rule, even if the Firm is a financial institution. The rule does reach a Firm's records about individuals: personal tax returns, household bookkeeping, or an owner's personal accounts mixed into the business file. A Firm that also prepares individual returns is covered for that work. How many target Firms do so was not researched. A lawyer should confirm this reading.

### 1.3 What a covered Firm must require of its software providers

A "service provider" is "any person or entity that receives, maintains, processes, or otherwise is permitted access to customer information through its provision of services directly to a financial institution" (314.2(r)). A covered Firm must oversee service providers by:

1. "Taking reasonable steps to select and retain service providers that are capable of maintaining appropriate safeguards for the customer information at issue";
2. "Requiring your service providers by contract to implement and maintain such safeguards"; and
3. "Periodically assessing your service providers based on the risk they present and the continued adequacy of their safeguards."

([16 CFR 314.4(f)](https://www.ecfr.gov/current/title-16/section-314.4))

The FTC's guide puts the contract point this way: "Your contracts must spell out your security expectations, build in ways to monitor your service provider's work," and "provide for periodic reassessments of their suitability for the job." ([FTC guide](https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know))

On what counts as a sufficient check, the FTC declined to let a certificate settle the matter alone: "The fact that a company maintains an information security certification may be a significant part of assessing the adequacy of a service provider's safeguards, but the Commission declines to prescribe a one-size-fits all approach". It added that for large providers oversight "may consist of reviewing public reports", and that in other cases "certifications, reports, or even third-party audits may be appropriate." ([86 FR 70272, 70296, Dec. 9, 2021](https://www.govinfo.gov/content/pkg/FR-2021-12-09/html/2021-25736.htm))

A covered Firm must also report to the FTC, within 30 days of discovery, any unauthorised acquisition of unencrypted customer information of at least 500 consumers (314.4(j), in force since May 13, 2024). **[My reading]** A breach at Ledger involving such information would be the Firm's to report, so the Firm needs prompt notice from Ledger. ([16 CFR 314.4(j), 314.5](https://www.ecfr.gov/current/title-16/section-314.4); [FTC blog, May 14, 2024](https://www.ftc.gov/business-guidance/blog/2024/05/safeguards-rule-notification-requirement-now-effect))

### 1.4 Does the rule apply to Ledger directly?

The FTC has twice said that financial data processors and financial software makers are themselves financial institutions.

- 2000: "financial software and hardware manufacturers, as described, are financial institutions but will have no disclosure obligations if they sell only to businesses." ([65 FR 33646, 33655, May 24, 2000](https://www.govinfo.gov/content/pkg/FR-2000-05-24/html/00-12755.htm))
- 2002: "check printers, data processors, and real property appraisers that receive customer information as service providers for a financial institution will also be directly subject to the rule because they are themselves financial institutions." ([67 FR 36484, 36486](https://www.govinfo.gov/content/pkg/FR-2002-05-23/html/02-12952.htm)) The same notice lists "data processors" among the entities the rule covers (at 36485).

**[My reading] [Unverified]** Ledger's whole business is processing financial data, so it probably meets the "financial institution" definition through the data-processing activity. The rule would then apply to Ledger directly for any customer information a covered Firm uploads. It would not apply to business Clients' records. No source found applies these statements to a product like Ledger, and both statements are more than twenty years old. Treat direct coverage as likely for individuals' records and confirm with a lawyer.

### 1.5 What the rule requires of whoever it covers

From [16 CFR 314.3 and 314.4](https://www.ecfr.gov/current/title-16/section-314.4):

| Requirement | Section |
|---|---|
| A written information security program sized to the business | 314.3(a) |
| One named "Qualified Individual" in charge (may be an outside provider) | 314.4(a) |
| A risk assessment that the program is built on | 314.4(b) |
| Access controls limiting each user to what they need | 314.4(c)(1) |
| Encryption of customer information "both in transit over external networks and at rest" | 314.4(c)(3) |
| Secure development practices for in-house applications | 314.4(c)(4) |
| Multi-factor authentication "for any individual accessing any information system" | 314.4(c)(5) |
| Secure disposal "no later than two years after the last date the information is used", with exceptions | 314.4(c)(6) |
| Change management; logging and monitoring of user activity | 314.4(c)(7)-(8) |
| Testing: continuous monitoring, or annual penetration testing plus vulnerability assessments every six months | 314.4(d) |
| Staff security training | 314.4(e) |
| Oversight of its own service providers | 314.4(f) |
| A written incident response plan | 314.4(h) |
| An annual written report to the board or senior officer | 314.4(i) |
| Notice to the FTC of a breach affecting 500 or more consumers | 314.4(j) |

**Small-holder exemption.** The written risk assessment (b)(1), the testing schedule (d)(2), the written incident response plan (h) and the annual report (i) "do not apply to financial institutions that maintain customer information concerning fewer than five thousand consumers." Everything else still applies. ([16 CFR 314.6](https://www.ecfr.gov/current/title-16/section-314.6))

### 1.6 Limits on reusing data received from a covered Firm

Separately from security, GLBA limits what a recipient may do with individuals' financial information received from a financial institution.

- Statute: a third party that receives such information "shall not ... disclose such information to any other person" unless the institution could lawfully have done so itself. ([15 U.S.C. 6802(c)](https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap94-subchapI-sec6802.htm))
- Regulation P applies to "third parties that are not financial institutions but that receive nonpublic personal information from financial institutions". A recipient that gets the information under the processing-and-servicing exceptions (sections 1016.14 and 1016.15) may disclose and use it only "in the ordinary course of business to carry out the activity covered by the exception under which you received the information." The regulation's example: a processor given a customer list "could not ... use that information for your own marketing purposes." ([12 CFR 1016.1(b)(1), 1016.11(a)](https://www.ecfr.gov/current/title-12/section-1016.11))
- A Firm that instead relies on the general service-provider exception must have a contract that "prohibits the third party from disclosing or using the information other than to carry out the purposes for which you disclosed the information". ([12 CFR 1016.13(a)(1)(ii)](https://www.ecfr.gov/current/title-12/section-1016.13))

These limits also cover only individuals' personal-purpose information, not business records (1016.1(b)(1)). Note that 16 CFR Part 313, which older FTC guidance cites, now covers only motor vehicle dealers; Regulation P is the live rule for everyone else. ([16 CFR 313.1(b)](https://www.ecfr.gov/current/title-16/section-313.1))

### 1.7 Truthful security claims (FTC Act, section 5)

This applies to Ledger whether or not GLBA does. The FTC states that when companies promise to safeguard personal information, "the FTC can and does take law enforcement action to make sure that companies live up these promises", under "Section 5 of the FTC Act, which bars unfair and deceptive acts and practices". ([FTC, Privacy and Security Enforcement](https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/privacy-security-enforcement)) The 2002 rule notice makes the same point about a firm's statements on how third parties handle data: "Misrepresentations regarding these issues could violate the Privacy Rule and Section 5 of the FTC Act." ([67 FR 36486, note 25](https://www.govinfo.gov/content/pkg/FR-2002-05-23/html/02-12952.htm))

**[My reading]** Every statement on Ledger's website and in its contract about security, AI use or audits must be true on the day it is published. Do not claim SOC 2, "bank-grade" security or "we never train on your data" until each is a fact.

---

## 2. IRS guidance for tax and accounting professionals

### 2.1 What the publications say

| Publication | What it says | Source |
|---|---|---|
| Pub. 4557, *Safeguarding Taxpayer Data* (Rev. 6-2024) | "According to the FTC Safeguards Rule, tax return preparers must create and enact security plans to protect client data." "The 'financial institutions' definition includes professional tax preparers." | [p4557.pdf](https://www.irs.gov/pub/irs-pdf/p4557.pdf) |
| Pub. 5708, *Creating a Written Information Security Plan for your Tax & Accounting Practice* (Rev. 8-2024) | "Not only is a WISP essential for your business and a good business practice, the law requires you to have one." "tax and accounting professionals are considered financial institutions, regardless of size." Prepared by the Security Summit as a sample, "not intended ... to create reliance". | [p5708.pdf](https://www.irs.gov/pub/irs-pdf/p5708.pdf) |
| Pub. 5709, *How to Create a WISP* (Rev. 5-2024) | "Federal law, enforced by the Federal Trade Commission, requires professional tax preparers to create and maintain a written data security plan." | [p5709.pdf](https://www.irs.gov/pub/irs-pdf/p5709.pdf) |
| Pub. 1345, e-file provider handbook (Rev. 10-2026) | "According to the FTC Safeguards Rule in Part 314 (16 C.F.R.), tax return preparers must create and enact security plans to protect client data." Multi-factor authentication "is required under FTC Safeguards Rule". | [p1345.pdf](https://www.irs.gov/pub/irs-pdf/p1345.pdf) |
| Form W-12, PTIN application (Rev. October 2026), line 11 | "I am aware that paid tax return preparers are required by law to create and maintain a written information security plan". | [fw12.pdf](https://www.irs.gov/pub/irs-pdf/fw12.pdf) |

A WISP is a written information security plan. The IRS does not create this duty. Each publication points to the FTC rule as the law.

### 2.2 What they say about vendors

- Pub. 4557 repeats the FTC duty: "select service providers that can maintain appropriate safeguards, make sure your contract requires them to maintain safeguards, and oversee their handling of customer information". ([p4557.pdf, p. 13](https://www.irs.gov/pub/irs-pdf/p4557.pdf))
- The Pub. 5708 sample plan makes the Firm's security coordinator responsible for "Requiring third-party service providers to implement and maintain appropriate security measures that comply with this WISP", and says "Any third-party service provider that does require access to information must be compliant with the standards contained in this WISP at a minimum." It tells Firms to list contractors, including "hosting vendors", among those authorised to handle client data. ([p5708.pdf, PDF pages 8, 11 and 19](https://www.irs.gov/pub/irs-pdf/p5708.pdf))

**[My reading]** A Firm following the IRS template will write Ledger into its own plan and will want a document from Ledger showing it meets the Firm's standard.

### 2.3 Does a bookkeeping-only Firm fall under the IRS guidance?

Every IRS publication above addresses "tax return preparers", "professional tax preparers" or "tax professionals". Pub. 5708 alone uses the wider phrase "tax and accounting professionals". None addresses a firm that keeps books and prepares no returns. **[Unverified]** whether the IRS regards such a firm as covered. The IRS has no authority over the Safeguards Rule in any case; the FTC does.

### 2.4 Section 7216: a separate tax-confidentiality rule

This applies only where a Firm prepares income tax returns and the information was furnished for that purpose. It matters for Ledger if a Firm prepares returns from the same books it keeps in Ledger.

- "Tax return information" is "any information ... which is furnished in any form or manner for, or in connection with, the preparation of a tax return of the taxpayer." ([26 CFR 301.7216-1(b)(3)](https://www.ecfr.gov/current/title-26/section-301.7216-1))
- A preparer may give such information to a software contractor "only to the extent necessary for the person to provide the contracted services", and only after giving the contractor's staff written notice of sections 7216 and 6713. "Contractors receiving tax return information pursuant to this section are tax return preparers under section 7216". ([26 CFR 301.7216-2(d)(2)](https://www.ecfr.gov/current/title-26/section-301.7216-2))
- If the recipient "is located outside of the United States, the taxpayer's consent ... prior to any disclosure is required." An example in the regulation treats a foreign contractor merely viewing data on a US server as a disclosure outside the US. ([26 CFR 301.7216-3(a)(3)(i)(D)](https://www.ecfr.gov/current/title-26/section-301.7216-3); [301.7216-2(d)(3), Example 3](https://www.ecfr.gov/current/title-26/section-301.7216-2))
- The IRS describes the penalties as "Civil and criminal preparer penalties ... for unauthorized use or disclosure of tax return information." ([IRS OPR Issue 2026-19](https://www.irs.gov/pub/opr-taxpros/issue-number-2026-19-introductory-guidelines-for-responsible-ai-use-in-federal-tax-practice.pdf))

**[My reading]** Bank statements uploaded for month-end bookkeeping are not obviously "furnished ... in connection with the preparation of a tax return". Once the same Firm uses those books for the Client's return, the line blurs. Keeping all storage, processing and staff access in the US, and using the data only to provide the service, keeps Ledger on the safe side of this rule without deciding the question.

---

## 3. Professional rules that bind CPA Firms

These apply to Firms whose owners are AICPA members or are bound by a state board that adopts the AICPA Code. They do not bind unlicensed bookkeepers, and they do not bind Ledger. They shape what a CPA Firm must get from Ledger. Source: [AICPA Code of Professional Conduct, updated through September 2026](https://pub.aicpa.org/codeofconduct/ethicsresources/et-cod.pdf).

- **Interpretation 1.700.040.** Before disclosing confidential client information to a third-party service provider, the member should either (a) "Enter into a contractual agreement with the third-party service provider to maintain the confidentiality of the information and provide reasonable assurance that the third-party service provider has appropriate procedures in place to prevent the unauthorized release of confidential information", or (b) "Obtain specific consent from the client".
- **Interpretation 1.150.040.** Before using a third-party service provider to help deliver professional services, "the member should inform the client, preferably in writing". This is not required for "administrative support services ... (for example, record storage, software application hosting, or authorized e-file tax transmittal services)."

**[My reading]** Route (a) is the practical one: a confidentiality clause plus public information about Ledger's controls. Whether AI agents that do the bookkeeping count as "software application hosting" or as a provider assisting in the professional service is not answered by the Code. If the latter, the Firm should tell its Clients in writing.

---

## 4. State laws that bind Ledger directly

Four states were read: California, New York, Texas and Massachusetts. The FTC states that "All states, the District of Columbia, Puerto Rico, and the Virgin Islands have enacted legislation requiring notification" of breaches. ([FTC, Data Breach Response: A Guide for Business, August 2023](https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business)) The other states were not read.

These laws protect individuals, not companies. They are triggered by a person's name together with a Social Security number, driver's licence number, or financial account number. Bookkeeping files routinely contain these: payroll records, contractor tax forms, owners' details and sole proprietors' bank statements.

### 4.1 Breach notification: Ledger must tell the Firm

In each state read, the business that owns the data (the Firm) notifies the affected people and regulators. A business that only holds the data (Ledger) must notify the owner.

| State | Duty of a business that holds data it does not own | Owner's deadline to notify individuals | Source |
|---|---|---|---|
| California | Notify the owner "immediately following discovery" | "within 30 calendar days"; sample notice to the Attorney General within 15 calendar days if more than 500 residents | Civ. Code 1798.82(a), (b), (f). Read in a [republished copy](https://california.public.law/codes/ca_civ_code_section_1798.82) marked updated Jan. 1, 2026; the 500-resident threshold is confirmed on the [Attorney General's page](https://oag.ca.gov/privacy/databreach/reporting) |
| New York | Notify the owner "immediately, provided that such notification shall be made within thirty days following discovery" | Within thirty days; state agencies also notified | [Gen. Bus. Law 899-aa(2), (3), (8)](https://www.nysenate.gov/legislation/laws/GBS/899-AA), revision of 2025-03-28 |
| Texas | Notify the owner "immediately after discovering the breach" | Not later than the 60th day; Attorney General within 30 days if at least 250 residents | [Bus. & Com. Code 521.053(b), (c), (i)](https://statutes.capitol.texas.gov/Docs/BC/htm/BC.521.htm) |
| Massachusetts | Notify the owner "as soon as practicable and without unreasonable delay" and cooperate | Same standard; Attorney General and consumer affairs office also notified | [M.G.L. c. 93H, s. 3](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter93H/Section3) |

**[Unverified]** The California text was not read on the official site, which refused automated access.

### 4.2 Data security duties

| State | Who is bound | What is required | Source |
|---|---|---|---|
| Massachusetts | "Every person that owns or licenses personal information about a resident". "Owns or licenses" is defined to include one that "receives, stores, maintains, processes, or otherwise has access to personal information in connection with the provision of goods or services". | "a comprehensive information security program that is written". Named technical minimums include secure user authentication, access limited to need, "Encryption of all transmitted records and files containing personal information that will travel across public networks", encryption on laptops and portable devices, monitoring, firewalls and patching. The owner must select capable service providers and require safeguards "by contract". | 201 CMR 17.02-17.04, read in [Cornell LII's copy](https://www.law.cornell.edu/regulations/massachusetts/201-CMR-17-03); authorised by [M.G.L. c. 93H, s. 2](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter93H/Section2) |
| California | A business that "owns, licenses, or maintains personal information about a California resident" | "reasonable security procedures and practices". A business that discloses such information to a third party must "require by contract that the third party implement and maintain reasonable security". A business regulated by a stricter state or federal law is deemed compliant if it complies with that law. | Civ. Code 1798.81.5(b), (c), (e), read in a [republished copy](https://california.public.law/codes/ca_civ_code_section_1798.81.5) |
| Texas | "A business" as to sensitive personal information "collected or maintained by the business" | "implement and maintain reasonable procedures"; destroy records not being retained. Does not apply to a GLBA financial institution. | [Bus. & Com. Code 521.052](https://statutes.capitol.texas.gov/Docs/BC/htm/BC.521.htm) |
| New York | A business that "owns or licenses computerized data which includes private information of a resident of New York" | Reasonable administrative, technical and physical safeguards. The business must select capable service providers and require safeguards by contract. A business that is subject to and complies with GLBA rules is deemed compliant. Enforced by the Attorney General; no private lawsuit. | [Gen. Bus. Law 899-bb](https://www.nysenate.gov/legislation/laws/GBS/899-BB) |

**[Unverified]** The Massachusetts regulation was read in a republished copy because mass.gov refused automated access. The New York duty names owners and licensees; whether a vendor that only holds data is an "owner or licensee" there was not resolved.

**[My reading]** Massachusetts is the firm requirement. Its definition covers a vendor that merely stores or processes the data, and it turns on where the individual lives, not where the vendor is. One Massachusetts resident's name and account number in any Firm's upload means Ledger needs a written security program. California, Texas and New York ask for "reasonable" security without listing controls, and California and New York treat compliance with GLBA rules as enough for a business those rules govern. A program written to the Safeguards Rule list in section 1.5 meets Massachusetts's written-program requirement and is the most defensible answer to "reasonable" in the other three.

### 4.3 General consumer-privacy laws

These mostly do not reach a new, small Ledger directly, and they exclude most of the data involved.

- **California (CCPA).** Applies to a for-profit business with gross annual revenue over a threshold stated as $25 million, or that buys, sells or shares personal information of 100,000 or more consumers or households, or that derives half its revenue from selling personal information. Personal information "subject to the federal Gramm-Leach-Bliley Act" is exempt, except from the breach lawsuit provision. A vendor qualifies as a "service provider" only under a written contract that bars it from using the data for anything but the specified purpose and from combining it with other customers' data. A service provider that engages a subcontractor "shall notify the business of that engagement" and bind the subcontractor by written contract. ([Civ. Code 1798.140(d), (ag), 1798.145(e), statute as posted by the California Privacy Protection Agency, edition effective 01/01/2025](https://cppa.ca.gov/regulations/pdf/ccpa_statute.pdf); [Attorney General's CCPA page, updated August 28, 2026](https://oag.ca.gov/privacy/ccpa)) **[Unverified]** The statute copy notes the dollar threshold "has been updated"; the current figure was not confirmed.
- **Texas (TDPSA).** Does not apply to "a small business as defined by the United States Small Business Administration", to a GLBA financial institution or its data, or to individuals "acting in a commercial or employment context". Where it applies, a processor must follow the controller's instructions under a contract that requires confidentiality, deletion or return of data at the controller's direction, and written contracts with subcontractors. Instead of letting each controller assess it, a processor "may arrange for a qualified and independent assessor to conduct an assessment ... using an appropriate and accepted control standard or framework" and give the report to the controller on request. ([Bus. & Com. Code 541.002, 541.104](https://statutes.capitol.texas.gov/Docs/BC/htm/BC.541.htm))
- **Virginia (VCDPA).** Applies only above 100,000 consumers a year, or 25,000 with half of revenue from selling data. It excludes GLBA institutions and data and people acting in a commercial or employment context. Processor duties mirror Texas. ([Va. Code 59.1-576](https://law.lis.virginia.gov/vacode/title59.1/chapter53/section59.1-576/), [59.1-579](https://law.lis.virginia.gov/vacode/title59.1/chapter53/section59.1-579/))

**[My reading]** These laws do not set a launch requirement. They do describe the contract terms a larger Firm will ask for: use only for the service, confidentiality, deletion or return on request, a list of subcontractors bound by the same terms. The independent-assessor option in Texas and Virginia is the legal slot an audit report such as SOC 2 fits into: one report in place of many customer audits. Other states' privacy laws were not read.

---

## 5. A contract that binds Ledger now: Intuit's developer terms

To connect to QuickBooks Online, Ledger accepts the [Intuit Developer Terms of Service](https://developer.intuit.com/app/developer/qbo/docs/legal-agreements/intuit-terms-of-service-for-intuit-developer-services) (dated October 14, 2025) and Intuit's platform requirements. These are contract duties, enforceable by Intuit cutting off access. Intuit's pages load only in a browser; the text was read from the static copies those pages are built from, linked in the Sources table.

**Who is covered.** "All apps that connect to production QuickBooks Online companies are expected to comply ... This includes both private (i.e., unlisted) apps and apps that want to be listed on the App Store." Production keys are issued only after a self-assessment questionnaire is approved, and the production app details require a privacy policy URL and an end-user licence agreement URL. ([Publishing requirements and guidelines](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/platform-requirements); [Publish your app](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app))

**From the Terms of Service:**

| Clause | Duty |
|---|---|
| 12.2 | Use QuickBooks data "solely for the purposes of providing Users the functionality of your Developer Application ... within the boundaries of the User's consent" |
| 12.2 | "Obtain and maintain a User's written consent, as required by Applicable Law" and give clear disclosures of how data is used and shared |
| 12.2 | Not "sell or otherwise make available" the data to any third party for a use that does not support the user's use of the app |
| 12.2 | For any "third parties, service providers or processors acting on your behalf", have a written agreement with "data protection and security requirements that are at least as restrictive as those provided in this Agreement", and enforce it |
| 12.2 | "Securely Delete User Data or Personal Information at the request of User", subject to legal record-keeping duties |
| 12.2 | Comply with Intuit's Data Stewardship Principles and Responsible AI Principles |
| 11.7 | "comply with the standards imposed by the National Institute of Standards and Technology ('NIST') ... including but not limited to, your use of any Artificial Intelligence ('AI'), Large Language Models ('LLMs')" |
| 13.1 | Have policies and procedures to protect data and to detect, respond to and remediate security incidents |
| 13.4 | Notify Intuit "no later than twenty-four (24) hours, after discovery of a Security Incident" |
| 6.2, 13.7 | Intuit may test and audit the app at any time, and may require a third-party security audit at the developer's expense after a suspected incident |

**From the security and platform requirements:**

- "Encrypt the refresh token with a symmetric algorithm (3DES or AES). AES is preferred."
- "You must not log any user's credentials or QuickBooks data."
- "HTTPS is enforced on all pages of your app." TLS 1.2 with AES-256 is recommended.
- "Your app does not provide third-parties with access to a customer's QuickBooks data, via external API calls or any other means."
- "Your app cannot export, save, or store QuickBooks data for any purpose other than the functional use of your app."
- If one customer's data is shared across customer accounts, it must be aggregated and anonymised and used only for insights to customers.
- "Any breach that occurs henceforth must be reported immediately via our support page."
- The app must be "operational and available ... 99.95% of the time".

([Security requirements](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/security-requirements); [Publishing requirements and guidelines](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/platform-requirements))

**[Sources disagree]** Intuit's two pages differ on review. The platform page says "All apps on our platform will undergo an annual security review." The security page says "All apps list on the app store, and any app with over 500 connections, will be reviewed by Intuit on an annual basis".

**[Unverified]** The self-assessment questionnaire sits behind a developer sign-in and was not seen. Intuit's Data Stewardship Principles page could not be opened. Clause 11.7 does not say which NIST standards are meant. Intuit's rule against giving third parties access to QuickBooks data "via external API calls" sits beside clause 12.2, which allows processors under a written agreement; no source says how Intuit treats sending QuickBooks data to an outside AI model provider.

---

## 6. What the market shows: security pages of established accounting-software vendors

These are the vendors' own statements. None was checked against an audit report.

| Vendor | Independent audit claimed | Encryption stated | Data location | Deletion | Other | Source |
|---|---|---|---|---|---|---|
| Karbon | "SOC 2 Type 2 certified"; ISO 27001 followed but "not yet been independently certified" | TLS in transit; "AES-256 bit" at rest | Not stated | "On request, Karbon will securely delete a customer's Karbon data." | Staff multi-factor sign-in required; penetration testing | [karbonhq.com/security](https://karbonhq.com/security/) |
| Xero | "certified as compliant with ISO/IEC ISO27001:2022"; SOC 2 reports from independent audits, type not stated | Encryption "when it's transferred and stored" | Not on the security page | Data addendum: copy kept "for a period of 7 years" after termination, deleted sooner on request | Addendum: "at least 30 days' notice" of subcontractor changes; incident notice "without undue delay"; SOC 2 report on request | [Security](https://www.xero.com/us/security/); [Data Processing Addendum, updated 11 February 2025](https://www.xero.com/us/legal/terms/data-processing/) |
| Canopy | "SOC 2 type II" | "256-bit encryption ... both in transit and at rest" | Not stated | Not stated | Multi-factor and single sign-on; role permissions; audit log | [getcanopy.com/security](https://www.getcanopy.com/security) |
| Digits | "SOC 2 Type II compliant" | TLS; data encrypted at rest with per-organisation keys | Not stated | Not stated | "revocable tokens" for data access | [digits.com/security](https://digits.com/security) |
| Dext | "ISO/IEC 27001:2022"; SOC 2 not stated | "TLS 1.2 or higher"; AES-256 at rest | Hosted on Amazon Web Services; region not stated | Not stated | "annual third-party penetration tests"; page updated August 2024 | [dext.com/us/security](https://dext.com/us/security) |
| BILL | "annual SOC 1 and SOC 2 Type II Audit" | TLS; additional encryption of sensitive data | "secure data center facilities"; location not stated | Not stated | Two-factor sign-in; public vulnerability-reporting programme | [bill.com/security](https://www.bill.com/security) |
| Puzzle | Not stated | "AES 256-bit" | "on our US servers" | Not stated | Integrations are "read-only" | [puzzle.io/security](https://www.puzzle.io/security) |

**What this shows.**

- **Independent audit.** Five of seven claim SOC 2; four of those say Type 2. One claims ISO 27001 only. One states neither.
- **Encryption** in transit and at rest is stated by all seven.
- **Data location** is stated by two of seven, and only loosely.
- **Deletion on request** is stated by two of seven.
- **A data-processing agreement** appears on one vendor's site (Xero). The others do not mention one on their security pages.

**What SOC 2 is.** The AICPA describes SOC as "a suite of service offerings CPAs may provide". Its SOC 2 guide is titled "Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy" and is written for "CPAs in public practice engaged to perform SOC 2 and SOC 3® examinations". The AICPA's pages call it an examination; they do not call it a certification. ([AICPA SOC suite](https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services); [AICPA SOC 2 guide page](https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy)) No statute or regulation read for this note requires a vendor to hold one.

**[Unverified]** The usual explanation is that a Type 1 report covers control design at a point in time and a Type 2 report covers how controls operated over a period. The AICPA pages that could be opened do not state this. Pages for Botkeeper, TaxDome, Pilot, Truewind and QuickBooks' own security page could not be opened. This evidence shows what vendors advertise. It does not show what Firms actually demand before buying.

---

## 7. Using AI models on Client financial data

No source found prohibits it. The sources that address it fall into five groups.

### 7.1 IRS Office of Professional Responsibility, June 24, 2026

*Introductory Guidelines for Responsible AI Use in Federal Tax Practice* (Issue 2026-19) is addressed to practitioners under Circular 230: CPAs, enrolled agents and attorneys in federal tax work. It does not address bookkeeping. It reaches a Firm whose people hold those licences and do tax work. ([IRS OPR Issue 2026-19](https://www.irs.gov/pub/opr-taxpros/issue-number-2026-19-introductory-guidelines-for-responsible-ai-use-in-federal-tax-practice.pdf))

- Risk named: "client privacy can be compromised when data generated for one client is repurposed by the program to respond to an inquiry concerning another client".
- "Practitioners must strictly handle all client data using only secure, enterprise-approved AI."
- Firm procedures must cover "Contracting with external providers", where "Outsourced or third-party AI tools should be vetted."
- Listed practices include "Document AI usage and verification processes", "Vet third parties' AI offerings when or before purchasing", "Never upload sensitive data to unsecured sites" and "Treat the written text that AI generates as drafts."
- "final decisions must always rest with qualified professionals".

### 7.2 The accounting profession's ethics body

- The AICPA Code rules in section 3 apply to an AI vendor as to any third-party service provider. **[Unverified]** This is the reading given in trade sources; the Code itself does not mention AI.
- AICPA Professional Ethics Division staff, writing in the AICPA's journal on November 2, 2026, advise that when a firm is asked to sell or share client data for AI training, "the prudent default response" is to decline. They add: "Redaction does not, by itself, turn confidential client information into nonconfidential information." They describe this as "caution, not a claim that AICPA rules categorically prohibit every data transfer." ([Journal of Accountancy, Nov. 2, 2026](https://www.journalofaccountancy.com/issues/2026/nov/asked-to-sell-firm-data-for-ai-training-be-very-cautious/))
- An earlier staff article says: "Some publicly available generative AI tools employ user inputs to train future models", and "Before pasting client data into any AI system, stop and ask: Is this confidential client information?" It points to a nonauthoritative AICPA staff paper, *AI Through an Ethics Lens*. ([Journal of Accountancy, Aug. 5, 2026](https://www.journalofaccountancy.com/issues/2026/aug/accounting-ethics-in-the-age-of-ai/)) **[Unverified]** The staff paper itself could not be opened. Journal articles are commentary, not rules.

### 7.3 The FTC

- FTC staff, January 9, 2024: AI service companies that break promises about customer data "may be liable under the laws enforced by the FTC", including promises not to use it "for secret purposes, such as to train or update their models". "There is no AI exemption from the laws on the books." Past orders have required companies to "delete any products—including models and algorithms" built on unlawfully obtained data. ([FTC Office of Technology blog](https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/01/ai-companies-uphold-your-privacy-confidentiality-commitments))
- FTC staff, February 13, 2024: "It may be unfair or deceptive for a company to adopt more permissive data practices" through "a surreptitious, retroactive amendment to its terms of service or privacy policy." ([FTC blog](https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/02/ai-other-companies-quietly-changing-your-terms-service-could-be-unfair-or-deceptive))
- FTC, September 18, 2023: a notice to five tax-preparation companies that using information collected in a confidential context "for purposes not explicitly requested by the individual" can bring civil penalties, then stated as up to "$50,120 per violation". ([FTC press release](https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-warns-tax-preparation-companies-about-misuse-consumer-data))

These are staff posts and a warning notice, not regulations. All three pages were still published on the date read.

### 7.4 Contract and statute terms already covered above

- Intuit: use QuickBooks data only for the app's function; written agreement with any processor "at least as restrictive"; comply with NIST standards for AI use; comply with Intuit's Responsible AI Principles, which include "Accountability", "Transparency" and "Privacy and security". (Section 5; [Intuit Responsible AI Principles](https://www.intuit.com/privacy/responsible-ai/))
- NIST's AI Risk Management Framework "is intended for voluntary use". Version 1.0 was "Released on January 26, 2023"; a generative AI profile followed on July 26, 2024. ([NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)) Intuit's clause turns a voluntary framework into a contract term without saying which document it means.
- GLBA reuse limits (section 1.6) and section 7216 (section 2.4) both restrict use of covered information to the purpose it was given for. **[My reading]** Training a model on it is a different purpose.
- California's service-provider definition requires notifying the business when a subcontractor is engaged (section 4.3). **[My reading]** An AI model provider is such a subcontractor.
- Texas's processor duties now refer to "personal data collected, stored, and processed by an artificial intelligence system". ([Bus. & Com. Code 541.104(a)(2)](https://statutes.capitol.texas.gov/Docs/BC/htm/BC.541.htm)) Texas's separate AI statute, in force January 1, 2026, bans certain intentional misuses such as manipulation and unlawful discrimination; its section headings show nothing aimed at bookkeeping. ([Bus. & Com. Code ch. 552](https://statutes.capitol.texas.gov/Docs/BC/htm/BC.552.htm)) **[Unverified]** It was not analysed beyond its headings.
- The IRS notes that "Several states, including California, Colorado, Illinois, and Utah, have enacted AI governance legislation". ([IRS OPR Issue 2026-19](https://www.irs.gov/pub/opr-taxpros/issue-number-2026-19-introductory-guidelines-for-responsible-ai-use-in-federal-tax-practice.pdf)) **[Unverified]** Those laws were not read.

### 7.5 What AI model providers and a peer vendor state

- OpenAI: "As of March 1, 2023, data sent to the OpenAI API is not used to train or improve OpenAI models" unless the customer opts in. Abuse-monitoring logs are "retained for up to 30 days, unless longer retention is required by law". Zero retention is available only with "prior approval by OpenAI". ([OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data))
- Anthropic: "Anthropic may not train models on Customer Content from Services." A data-processing addendum "is incorporated into these Terms by reference." ([Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms); [privacy note updated August 18, 2026](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training))
- Canopy, a practice-management vendor for accountants, publishes an AI page: it will "never use your data for training or testing AI models unless you explicitly opt in"; "Your data is never used to train general-purpose models built by vendors like OpenAI or Anthropic"; and "every output is editable, and you make the final call." ([getcanopy.com/ai-governance](https://www.getcanopy.com/ai-governance))

**[My reading]** The repository shows the current apps were built on one AI vendor's hosting. Which model provider, which plan and which retention setting Ledger will use in production is an open question. The answer decides what Ledger can truthfully promise Firms.

---

## 8. Required before the first Firm's real data, versus expected by the market

"Required" means a statute, regulation or contract Ledger is party to says so. "Conditional" means required if a stated fact is true.

| Item | Standing | Basis |
|---|---|---|
| Keep personal information reasonably secure | **Required** | California 1798.81.5(b); Texas 521.052(a) (section 4.2) |
| Written security program | **Conditional**: required once any Massachusetts resident's personal information is held, or if the Safeguards Rule applies directly | 201 CMR 17.03; 16 CFR 314.3 |
| Encrypt data sent over public networks; HTTPS everywhere | **Required** | 201 CMR 17.04(3); Intuit security requirements |
| Encrypt QuickBooks tokens; keep QuickBooks data out of logs | **Required** (contract) | Intuit security requirements |
| Encrypt stored data; two-step sign-in for every user | **Conditional**: required if the Safeguards Rule applies directly. Otherwise universal market practice | 16 CFR 314.4(c)(3), (5); section 6 |
| Tell the Firm immediately about a breach | **Required** | State breach laws (section 4.1) |
| Tell Intuit within 24 hours of a security incident | **Required** (contract) | Intuit Terms 13.4 |
| Written policies for detecting and responding to incidents | **Required** (contract) | Intuit Terms 13.1 |
| A contract with each Firm covering security, confidentiality and use only for the service | **Required of the Firm**, so Ledger must offer it | 16 CFR 314.4(f)(2); 12 CFR 1016.13; 201 CMR 17.03(2)(f); California 1798.81.5(c); New York 899-bb; AICPA 1.700.040 |
| Written agreements with Ledger's own suppliers (cloud host, AI model provider) at least as strict | **Required** (contract) for QuickBooks data | Intuit Terms 12.2 |
| Delete data on request | **Required** (contract) for QuickBooks data | Intuit Terms 12.2 |
| Use Client data only to provide the service; no model training on it | **Required** (contract) for QuickBooks data; **Conditional** for individuals' data and tax return information | Intuit Terms 12.2; 12 CFR 1016.11; 26 CFR 301.7216-2 |
| Privacy policy and licence terms published | **Required** (contract) to obtain QuickBooks production keys | Intuit, Publish your app |
| Security and AI claims that are true | **Required** | FTC Act s. 5 (section 1.7) |
| Storage, processing and staff access inside the US | **Conditional**: needed without taxpayer consent where tax return information is involved | 26 CFR 301.7216-3 |
| SOC 2 report | **Market expectation**. No law read requires it | Section 6; 86 FR 70296 |
| Third-party penetration test | **Market expectation**. Required by rule only if the Safeguards Rule applies directly, 5,000 or more consumers are held, and there is no continuous monitoring. Intuit may ask for scan results | 16 CFR 314.4(d)(2), 314.6; Intuit security requirements |
| Published list of subcontractors with advance notice of changes | **Market expectation** in the US | Xero addendum (section 6) |
| Single sign-on; choice of data region; ISO 27001 | **Market expectation** | Section 6 |
| GDPR-style data-processing agreement | **Market expectation** in the US; a legal requirement for UK or EU Firms | Section 9 |

---

## 9. Does the US-only assumption matter?

Yes. Two checks, neither in depth:

- **United Kingdom.** "Whenever a controller uses a processor, there must be a written contract (or other legal act) in place." A processor "has some direct responsibilities under the UK GDPR" and "may not engage a sub-processor's services without the controller's prior specific or general written authorisation." ([Information Commissioner's Office, Contracts](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/contracts/), latest update 19 May 2023, marked under review) A UK Firm could not lawfully use Ledger without that contract, and sending its data to a US AI provider would raise international-transfer rules that were not researched.
- **Canada.** The federal privacy law "applies to private-sector organizations across Canada that collect, use, or disclose personal information", and an organisation stays responsible for "any personal information you transfer to a third party for processing", ensuring protection "through contractual or other means". Alberta, British Columbia and Quebec have their own laws. ([Office of the Privacy Commissioner, PIPEDA in brief](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/); [Accountability principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_accountability/))

Intuit's platform page also names these regimes: an app "must comply with any applicable laws related to customer data, including but not limited to the GDPR, CCPA, LGPD and PIPEDA". ([Publishing requirements](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/platform-requirements))

**[My reading]** A self-serve public sign-up will accept a Canadian or UK Firm unless something stops it. Either sign-up is limited to US Firms at launch, or the non-US rules have to be researched before launch.

---

## Claims not verified from a primary source

- That a bookkeeping-only Firm is, or is not, covered by the Safeguards Rule.
- That Ledger is directly subject to the Safeguards Rule. This rests on FTC statements about "data processors" generally.
- California Civil Code 1798.82 and 1798.81.5 text, including the 30-day and 15-day deadlines. Read in a republished copy.
- Massachusetts 201 CMR 17.00 text. Read in Cornell LII's copy.
- Whether New York's security duty in section 899-bb reaches a vendor that only holds data.
- The current CCPA revenue threshold figure.
- The Type 1 versus Type 2 distinction for SOC 2 reports.
- That the AICPA treats AI vendors as third-party service providers, and the content of the AICPA staff paper *AI Through an Ethics Lens*.
- The content of Intuit's self-assessment questionnaire and of its Data Stewardship Principles.
- State AI laws beyond the section headings of Texas's.
- All vendor security claims in section 6. They are self-reported.
- Full sentences on ftc.gov guidance pages beyond the short fragments quoted.

## Points on which sources disagree

- **Coverage of accounting firms.** IRS Pub. 5708 says "tax and accounting professionals are considered financial institutions, regardless of size." The regulation's example covers an accountant "in the business of completing income tax returns", and the FTC's guide lists only "tax preparation firms". Trade sources say bookkeeping is covered.
- **Intuit's annual security review.** One Intuit page says all apps; another says App Store apps and apps with more than 500 connections.

---

## What this means for the decision

The decision this feeds is what Ledger commits to before launch and what waits.

**Commit before the first Firm's real data.** Each item is either required today or is the cheapest way to meet several requirements at once.

1. **A short written security program with one named person responsible.** Write it to the Safeguards Rule list in section 1.5. That one document meets Massachusetts's requirement, is the most defensible answer to "reasonable security" in California, Texas and New York, and is what a covered Firm must be able to point to.
2. **The baseline controls.** Encryption in transit and at rest, including QuickBooks tokens. Two-step sign-in for every Firm user and every Ledger operator. Each Firm's data separated from every other Firm's. Access limited to need. Activity logs that contain no QuickBooks data.
3. **A written incident plan with the deadlines in it.** Tell the Firm immediately. Tell Intuit within 24 hours. Give the Firm enough detail to meet its own duties to individuals and regulators, which run as short as 30 days.
4. **Terms for Firms that include data-protection terms.** Security commitments; confidentiality; use of Client data only to provide the service; no model training on Client data; breach notice; deletion or return on request and at the end of the subscription; a named list of suppliers.
5. **Written agreements with Ledger's own suppliers**, the cloud host and the AI model provider, that are at least as strict as what Ledger promises, with training on Ledger's data switched off and retention settings known.
6. **Working deletion.** The ability to delete one Client's or one Firm's data on request, and a stated retention period.
7. **US-only storage, processing and staff access**, stated in the terms.
8. **Sign-up limited to US Firms** until the non-US position is researched.
9. **Intuit's go-live steps**: privacy policy, licence terms and the self-assessment questionnaire.
10. **Only true claims.** Publish a plain security page describing what is actually in place.

**Can wait until after launch**, with a date attached so it does not drift.

- A SOC 2 report. It is what peers show, and the FTC says such a report can be "a significant part" of a Firm's vendor check. Controls put in place under item 1 are the same ones an auditor later examines, so starting item 1 properly shortens this.
- A third-party penetration test, before Ledger approaches 5,000 individuals' records or 500 QuickBooks connections.
- Single sign-on, a choice of data region, a public supplier-change notice period, ISO 27001.
- A UK, EU or Canadian data-processing agreement, unless non-US Firms are admitted.

**Needs a lawyer's answer before launch, because it changes the list above.**

- Whether Ledger is itself a GLBA "financial institution" and directly subject to the Safeguards Rule.
- What Ledger's terms should say about Firms uploading individuals' personal financial records and tax return information.

---

## Open questions

1. **Are all Firms in the United States?** Unconfirmed. If not, section 9 becomes launch work.
2. **Will Firms upload records about individuals?** Personal tax documents, household books, payroll files with Social Security numbers. This decides whether the Safeguards Rule, the GLBA reuse limits and section 7216 apply to Ledger in practice.
3. **Is Ledger a "financial institution" under GLBA through data processing?** The FTC statements are from 2000 and 2002. Needs a lawyer.
4. **Is a bookkeeping-only Firm a "financial institution"?** No primary source found. The IRS's wording and the regulation's example differ.
5. **How does Intuit treat sending QuickBooks data to an outside AI model provider?** Its security rule bars third-party access "via external API calls"; its terms allow processors under contract. The self-assessment questionnaire may answer this. It was not seen.
6. **Which NIST standards does Intuit's clause 11.7 require?** The clause does not say.
7. **Which AI model provider, plan and retention setting will Ledger use in production?** Is a data-processing agreement signed with it? Default API terms keep some logs for up to 30 days.
8. **Where is Ledger's data stored today, and who can reach it?** The starting code was hosted on one vendor's platform under one person's account.
9. **Do AI agents doing the bookkeeping make Ledger a provider "assisting" in professional services under the AICPA Code,** so that CPA Firms should tell their Clients in writing?
10. **What do Firms actually ask for before buying?** Section 6 shows what vendors advertise, not what buyers demand. A handful of conversations with target Firms would test whether SOC 2 can wait.
11. **The other 46 states' breach and security laws, other states' privacy laws, and the state AI laws** the IRS names were not read.
12. **Cyber insurance and limits of liability** in Ledger's terms were outside this research.

---

## Sources

All opened 2026-11-14.

| Source | Owner | Link |
|---|---|---|
| 16 CFR Part 314, Safeguards Rule (eCFR edition 2026-11-01) | FTC | https://www.ecfr.gov/current/title-16/part-314 (text pulled from https://www.ecfr.gov/api/versioner/v1/full/2026-11-01/title-16.xml?part=314) |
| 16 CFR Part 313 (scope) | FTC | https://www.ecfr.gov/current/title-16/part-313 |
| 12 CFR Part 1016, Regulation P | CFPB | https://www.ecfr.gov/current/title-12/part-1016 |
| 12 CFR 225.28, list of financial activities | Federal Reserve | https://www.ecfr.gov/current/title-12/section-225.28 |
| 26 CFR 301.7216-1 to -3 | Treasury | https://www.ecfr.gov/current/title-26/section-301.7216-1 |
| 15 U.S.C. 6801, 6802, 6809 (2024 edition) | US Code | https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap94-subchapI-sec6802.htm |
| 65 FR 33646 (May 24, 2000), Privacy Rule notice | FTC | https://www.govinfo.gov/content/pkg/FR-2000-05-24/html/00-12755.htm |
| 67 FR 36484 (May 23, 2002), Safeguards Rule notice | FTC | https://www.govinfo.gov/content/pkg/FR-2002-05-23/html/02-12952.htm |
| 86 FR 70272 (Dec. 9, 2021), Safeguards Rule amendments | FTC | https://www.govinfo.gov/content/pkg/FR-2021-12-09/html/2021-25736.htm |
| FTC Safeguards Rule: What Your Business Needs to Know (December 2024) | FTC | https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know |
| How To Comply with the Privacy of Consumer Financial Information Rule (July 2002) | FTC | https://www.ftc.gov/business-guidance/resources/how-comply-privacy-consumer-financial-information-rule-gramm-leach-bliley-act |
| Safeguards Rule notification requirement now in effect (May 14, 2024) | FTC | https://www.ftc.gov/business-guidance/blog/2024/05/safeguards-rule-notification-requirement-now-effect |
| Data Breach Response: A Guide for Business (August 2023) | FTC | https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business |
| Privacy and Security Enforcement | FTC | https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/privacy-security-enforcement |
| AI Companies: Uphold Your Privacy and Confidentiality Commitments (Jan. 9, 2024) | FTC staff | https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/01/ai-companies-uphold-your-privacy-confidentiality-commitments |
| AI (and other) Companies: Quietly Changing Your Terms of Service (Feb. 13, 2024) | FTC staff | https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/02/ai-other-companies-quietly-changing-your-terms-service-could-be-unfair-or-deceptive |
| FTC Warns Tax Preparation Companies About Misuse of Consumer Data (Sept. 18, 2023) | FTC | https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-warns-tax-preparation-companies-about-misuse-consumer-data |
| Publication 4557 (Rev. 6-2024) | IRS | https://www.irs.gov/pub/irs-pdf/p4557.pdf |
| Publication 5708 (Rev. 8-2024) | IRS / Security Summit | https://www.irs.gov/pub/irs-pdf/p5708.pdf |
| Publication 5709 (Rev. 5-2024) | IRS | https://www.irs.gov/pub/irs-pdf/p5709.pdf |
| Publication 1345 (Rev. 10-2026) | IRS | https://www.irs.gov/pub/irs-pdf/p1345.pdf |
| Form W-12 (Rev. October 2026) | IRS | https://www.irs.gov/pub/irs-pdf/fw12.pdf |
| OPR Issue 2026-19, Responsible AI Use in Federal Tax Practice (June 24, 2026) | IRS | https://www.irs.gov/pub/opr-taxpros/issue-number-2026-19-introductory-guidelines-for-responsible-ai-use-in-federal-tax-practice.pdf |
| Code of Professional Conduct (through September 2026) | AICPA | https://pub.aicpa.org/codeofconduct/ethicsresources/et-cod.pdf |
| SOC suite of services | AICPA | https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services |
| SOC 2 guide page | AICPA | https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy |
| Asked to sell firm data for AI training? (Nov. 2, 2026) | Journal of Accountancy (AICPA) | https://www.journalofaccountancy.com/issues/2026/nov/asked-to-sell-firm-data-for-ai-training-be-very-cautious/ |
| Accounting ethics in the age of AI (Aug. 5, 2026) | Journal of Accountancy (AICPA) | https://www.journalofaccountancy.com/issues/2026/aug/accounting-ethics-in-the-age-of-ai/ |
| California Civil Code 1798.82 (republished copy) | public.law | https://california.public.law/codes/ca_civ_code_section_1798.82 |
| California Civil Code 1798.81.5 (republished copy) | public.law | https://california.public.law/codes/ca_civ_code_section_1798.81.5 |
| Data breach reporting | California Attorney General | https://oag.ca.gov/privacy/databreach/reporting |
| CCPA page (updated August 28, 2026) | California Attorney General | https://oag.ca.gov/privacy/ccpa |
| CCPA statute (edition effective 01/01/2025) | California Privacy Protection Agency | https://cppa.ca.gov/regulations/pdf/ccpa_statute.pdf |
| New York Gen. Bus. Law 899-aa | New York State Senate | https://www.nysenate.gov/legislation/laws/GBS/899-AA |
| New York Gen. Bus. Law 899-bb | New York State Senate | https://www.nysenate.gov/legislation/laws/GBS/899-BB |
| Texas Bus. & Com. Code ch. 521 | Texas Legislature | https://statutes.capitol.texas.gov/Docs/BC/htm/BC.521.htm (text pulled from https://tcss.legis.texas.gov/resources/BC/htm/BC.521.htm) |
| Texas Bus. & Com. Code ch. 541, 551, 552 | Texas Legislature | https://statutes.capitol.texas.gov/Docs/BC/htm/BC.541.htm |
| M.G.L. c. 93H, ss. 1-3 | Massachusetts Legislature | https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter93H/Section3 |
| 201 CMR 17.02-17.04 (republished copy) | Cornell LII | https://www.law.cornell.edu/regulations/massachusetts/201-CMR-17-03 |
| Va. Code 59.1-575, -576, -579 | Virginia Legislature | https://law.lis.virginia.gov/vacode/title59.1/chapter53/section59.1-576/ |
| Intuit Developer Terms of Service (October 14, 2025) | Intuit | https://developer.intuit.com/app/developer/qbo/docs/legal-agreements/intuit-terms-of-service-for-intuit-developer-services (static copy: https://static.developer.intuit.com/output_html/qbo/docs/legal-agreements/intuit-terms-of-service-for-intuit-developer-services.html) |
| Security requirements | Intuit | https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/security-requirements (static copy: https://static.developer.intuit.com/output_html/qbo/docs/go-live/publish-app/security-requirements.html) |
| Publishing requirements and guidelines | Intuit | https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/platform-requirements (static copy: https://static.developer.intuit.com/output_html/qbo/docs/go-live/publish-app/platform-requirements.html) |
| Publish your app | Intuit | https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app (static copy: https://static.developer.intuit.com/output_html/qbo/docs/go-live/publish-app.html) |
| Responsible AI Principles | Intuit | https://www.intuit.com/privacy/responsible-ai/ |
| AI Risk Management Framework | NIST | https://www.nist.gov/itl/ai-risk-management-framework |
| API data controls | OpenAI | https://developers.openai.com/api/docs/guides/your-data |
| Commercial Terms; training note (updated August 18, 2026) | Anthropic | https://www.anthropic.com/legal/commercial-terms ; https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training |
| Vendor security pages: Karbon, Xero, Canopy, Digits, Dext, BILL, Puzzle | Each vendor | Linked in section 6 |
| Xero Data Processing Addendum (updated 11 February 2025) | Xero | https://www.xero.com/us/legal/terms/data-processing/ |
| Canopy AI governance | Canopy | https://www.getcanopy.com/ai-governance |
| Contracts (UK GDPR guidance, updated 19 May 2023) | UK Information Commissioner's Office | https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/contracts/ |
| PIPEDA in brief (modified 2024-05-01); Accountability principle (modified 2020-08-13) | Office of the Privacy Commissioner of Canada | https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/ |
