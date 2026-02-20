# Data Sources & Methodology

## Our Commitment to Transparency

**Every piece of information on this platform comes from verified, credible sources.** We never display simulated, fake, or placeholder data. If data is unavailable, we clearly state that rather than showing false information.

---

## Data Collection Methodology

### 1. Source Credibility Assessment

We evaluate sources based on:
- **Primary Sources** (10/10): Government documents, official records, leaked documents
- **Academic Research** (9/10): Peer-reviewed papers, university research
- **NGO Reports** (8/10): Human Rights Watch, Amnesty International, ASPI
- **Investigative Journalism** (7/10): Major news organizations (BBC, NYT, AP, Reuters)
- **Verified Testimonies** (6/10): Survivor accounts with corroboration

### 2. Verification Process

All data undergoes:
1. **Source verification** - Confirm source authenticity
2. **Cross-referencing** - Verify with multiple independent sources when possible
3. **Date checking** - Ensure information is current or properly dated
4. **Link validation** - Verify all URLs are accessible
5. **Regular updates** - Review and update data quarterly

### 3. Data Update Frequency

- **Live RSS Feeds**: Real-time (30-second refresh)
- **Political Prisoners**: Monthly updates
- **Detention Facilities**: Quarterly updates (based on satellite imagery)
- **Sanctions Lists**: Weekly updates
- **CCP Officials**: Monthly updates

---

## Live Intelligence Feeds (RSS)

### News Sources

1. **Hong Kong Free Press**
   - URL: https://hongkongfp.com/feed/
   - Type: Independent news organization
   - Region: Hong Kong
   - Update Frequency: Hourly
   - Credibility: High

2. **Radio Free Asia - China**
   - URL: https://www.rfa.org/english/news/china/rss.xml
   - Type: US government-funded news service
   - Region: China
   - Update Frequency: Daily
   - Credibility: High

3. **Radio Free Asia - Uyghur**
   - URL: https://www.rfa.org/english/news/uyghur/rss.xml
   - Type: Dedicated Uyghur coverage
   - Region: Xinjiang
   - Update Frequency: Daily
   - Credibility: High

4. **Radio Free Asia - Tibet**
   - URL: https://www.rfa.org/english/news/tibet/rss.xml
   - Type: Dedicated Tibet coverage
   - Region: Tibet
   - Update Frequency: Daily
   - Credibility: High

5. **Taiwan News**
   - URL: https://www.taiwannews.com.tw/en/rss
   - Type: Independent Taiwan news
   - Region: Taiwan
   - Update Frequency: Hourly
   - Credibility: High

6. **South China Morning Post**
   - URL: https://www.scmp.com/rss/91/china
   - Type: Hong Kong-based newspaper
   - Region: China/Hong Kong
   - Update Frequency: Hourly
   - Credibility: Medium (Pro-Beijing editorial stance but credible reporting)

### Human Rights Organizations

1. **Human Rights Watch - China**
   - URL: https://www.hrw.org/news/china/rss
   - Type: NGO reports
   - Region: China
   - Update Frequency: Weekly
   - Credibility: High

2. **Amnesty International - China**
   - URL: https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/rss/
   - Type: NGO reports
   - Region: China
   - Update Frequency: Weekly
   - Credibility: High

---

## Major Data Sources by Category

### Political Prisoners

**Primary Sources:**
- [Dui Hua Foundation](https://duihua.org/) - Political prisoner database
- [Congressional-Executive Commission on China (CECC)](https://www.cecc.gov/political-prisoner-database) - US government database
- [Human Rights Watch](https://www.hrw.org/tag/political-prisoners) - Case documentation
- [Amnesty International](https://www.amnesty.org/) - Prisoner of conscience reports
- [Committee to Protect Journalists](https://cpj.org/) - Journalist prisoners

**Data File:** `/src/data/political_prisoners_research.json` (60 prisoners with source URLs)

**Last Updated:** December 2025

### Detention Facilities (Xinjiang)

**Primary Sources:**
- [ASPI Xinjiang Data Project](https://xjdp.aspi.org.au/) - Satellite imagery and facility mapping
- [Xinjiang Police Files](https://www.xinjiangpolicefiles.org/) - Leaked government documents
- [China Cables (ICIJ)](https://www.icij.org/investigations/china-cables/) - Leaked operational manuals
- [Uyghur Human Rights Project](https://uhrp.org/) - Survivor testimonies
- [Human Rights Watch](https://www.hrw.org/tag/xinjiang) - Investigation reports

**Data File:** `/src/data/detention_facilities_research.json`

**Methodology:** Satellite imagery analysis, leaked documents, survivor testimonies

**Last Updated:** December 2025

### Sanctioned Officials

**Primary Sources:**
- [US Treasury OFAC Sanctions List](https://sanctionssearch.ofac.treas.gov/) - Official US sanctions
- [UK Foreign Office Sanctions](https://www.gov.uk/government/collections/financial-sanctions-regime-specific-consolidated-lists-and-releases) - UK sanctions
- [EU Sanctions Map](https://www.sanctionsmap.eu/) - EU sanctions
- [Canada Sanctions](https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/index.aspx) - Canadian sanctions

**Data File:** `/src/data/sanctioned_officials_research.json`

**Update Frequency:** Weekly

**Last Updated:** December 2025

### Forced Labor Companies

**Primary Sources:**
- [ASPI Uyghurs for Sale Report](https://www.aspi.org.au/report/uyghurs-sale) - Supply chain research
- [US Customs and Border Protection](https://www.cbp.gov/trade/programs-administration/forced-labor) - Import restrictions
- [Sheffield Hallam University Reports](https://www.shu.ac.uk/helena-kennedy-centre-international-justice/research-and-projects/all-projects/in-broad-daylight) - Forced labor research
- [Congressional Research Service](https://crsreports.congress.gov/) - Policy reports
- [Corporate supply chain audits](https://www.business-humanrights.org/) - Company investigations

**Data File:** `/src/data/forced_labor_companies_research.json`

**Last Updated:** December 2025

### Confucius Institutes

**Primary Sources:**
- [National Association of Scholars](https://www.nas.org/blogs/article/how_many_confucius_institutes_are_in_the_united_states) - CI tracking
- [US State Department](https://www.state.gov/) - Foreign mission designations
- [University announcements](https://www.insidehighered.com/) - Closure announcements
- [Academic freedom reports](https://www.aaup.org/) - Academic concerns

**Data File:** `/src/data/confucius_institutes_research.json`

**Last Updated:** December 2025

### Police Stations (Overseas)

**Primary Sources:**
- [Safeguard Defenders Reports](https://safeguarddefenders.com/) - Investigation reports
- [FBI Announcements](https://www.fbi.gov/) - Law enforcement actions
- [European government statements](https://www.consilium.europa.eu/) - Official responses
- [News investigations](https://www.bbc.com/) - Investigative journalism

**Data File:** `/src/data/police_stations_research.json`

**Last Updated:** December 2025

### Human Rights Organizations

**Primary Sources:**
- Organization official websites
- [GuideStar](https://www.guidestar.org/) - Nonprofit verification
- [Charity Navigator](https://www.charitynavigator.org/) - Charity ratings
- Organization annual reports
- UN consultative status records

**Data File:** `/src/data/human_rights_orgs_research.json`

**Last Updated:** December 2025

### Academic Experts

**Primary Sources:**
- University faculty pages
- [Google Scholar](https://scholar.google.com/) - Publication records
- [ORCID](https://orcid.org/) - Researcher identification
- Academic publications
- Conference presentations

**Data File:** `/src/data/academic_experts_research.json`

**Last Updated:** December 2025

### International Responses

**Primary Sources:**
- [US State Department](https://www.state.gov/) - Official statements
- [UK Foreign Office](https://www.gov.uk/government/organisations/foreign-commonwealth-development-office) - UK responses
- [European External Action Service](https://www.eeas.europa.eu/) - EU statements
- [UN Human Rights Council](https://www.ohchr.org/) - UN resolutions
- Parliamentary records

**Data File:** `/src/data/international_responses_research.json`

**Last Updated:** December 2025

---

## Data Limitations & Transparency

### Known Limitations

1. **Xinjiang Detention Facilities**
   - Exact capacity numbers are estimates based on satellite imagery
   - Some facilities may be closed or repurposed
   - CCP censorship prevents complete documentation

2. **Political Prisoners**
   - Actual number far exceeds documented cases
   - Many prisoners held without public acknowledgment
   - Limited access to current health information

3. **Forced Labor**
   - Supply chains are complex and often obscured
   - Company participation may be indirect
   - Verification is challenging due to CCP restrictions

4. **Overseas Police Stations**
   - Some locations may have closed after exposure
   - New locations may exist but remain undocumented

### What We Don't Show

We **never** display:
- ❌ Simulated or fake data
- ❌ Unverified rumors
- ❌ Placeholder information
- ❌ Estimated data without clear methodology
- ❌ Data from unreliable sources

If we don't have verified information, we clearly state: **"No verified data available"**

---

## Data Quality Standards

### Required for All Data Entries

✅ **Source URL** - Direct link to original source
✅ **Date** - When information was published/verified
✅ **Source Type** - Government, NGO, Media, Academic, etc.
✅ **Verification Status** - Verified, Pending, Unverified
✅ **Last Updated** - When we last verified the information

### Quality Checks

- All URLs tested quarterly
- Dead links replaced or removed
- Information cross-referenced with multiple sources when possible
- Outdated information clearly marked
- Conflicting information noted with sources for both claims

---

## How to Report Issues

### Found Incorrect Information?

Please report to: [Create GitHub Issue](https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues)

Include:
1. Page/component where error appears
2. What information is incorrect
3. Correct information with source
4. Your contact information (optional)

### Have Additional Sources?

We welcome contributions! Please submit:
1. Source URL
2. Brief description
3. Why it's credible
4. What information it provides

---

## Technical Implementation

### Data Storage

- **JSON Files**: Structured data in `/src/data/` directory
- **RSS Feeds**: Real-time aggregation from 8 sources
- **Components**: Some use embedded data (being refactored to JSON)

### Source Attribution Components

- `SourceAttribution.jsx` - Displays source information
- `EmptyState.jsx` - Handles missing data transparently
- `SourcesList.jsx` - Lists multiple sources

### Refactoring Status

**Completed:**
- ✅ Live Intelligence Feed (uses real RSS)
- ✅ Empty state handling (no fake data)

**In Progress:**
- 🔄 Political Prisoners (refactoring to use JSON with sources)
- 🔄 Detention Facilities (adding source attribution display)
- 🔄 CCP Officials (linking to official sanction lists)

**Planned:**
- 📋 Company Tracker (add evidence links)
- 📋 Sanctions Tracker (link to official lists)
- 📋 All other components

See [SIMULATED_DATA_CLEANUP_TODO.md](./SIMULATED_DATA_CLEANUP_TODO.md) for detailed refactoring plan.

---

## Propaganda & Source Bias Assessment

### CCP Information Warfare — What We Guard Against

The Chinese Communist Party (CCP) operates the world's most sophisticated state-sponsored propaganda apparatus. We actively assess all sources against the following threats:

**CCP State Media (Never Cited as Evidence)**
- Xinhua News Agency — official CCP news organ
- CGTN (China Global Television Network) — international propaganda broadcaster
- Global Times — CCP-linked nationalist tabloid
- People's Daily / China Daily — official CCP publications

**Spamouflage / DRAGONBRIDGE**  
CCP-linked covert influence operation (documented by Meta, Google/Mandiant, Stanford Internet Observatory). Uses fake social media accounts to seed pro-CCP narratives, attack credible researchers, and discredit human rights reporting.

**Sources Targeted by CCP Disinformation (Verified Credible)**  
The CCP actively campaigns against credible researchers. Being targeted by CCP propaganda is itself evidence of credibility:
- **Dr. Adrian Zenz** — Senior Fellow, Victims of Communism Memorial Foundation. CCP has run 100+ Global Times attack articles against him. His Xinjiang estimates are corroborated by ASPI satellite data, the Xinjiang Police Files, BBC, BuzzFeed News, and US State Department reports.
- **ASPI (Australian Strategic Policy Institute)** — Their Xinjiang Data Project is based on verifiable satellite imagery. CCP attacks on ASPI are documented disinformation.
- **Safeguard Defenders** — Their overseas police station research was validated when multiple governments confirmed and closed stations.

**Source with Known CCP Ownership**  
- **South China Morning Post** — Owned by Alibaba Group since 2015. Has shifted toward pro-Beijing editorial stance. Used only for factual news reporting (court records, government statements). Never cited for analysis of CCP policies or human rights.

For full bias assessment methodology, see [SOURCE_BIAS_AUDIT.md](./SOURCE_BIAS_AUDIT.md).

### Bias Risk Levels

All sources in our registry are assessed with a bias risk level:

| Level | Meaning |
|-------|---------|
| **None** | Independent, credible, no known CCP influence |
| **Low** | Minor concern (e.g. disclosed state funding, single-community advocacy); use with awareness |
| **Medium** | Known CCP ownership/influence or editorial slant; cross-reference required |
| **CCP** | CCP state media or direct CCP propaganda — NEVER cited as evidence |

---

## Contact

For questions about data sources or methodology:
- GitHub Issues: https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues
- Email: [Contact through GitHub]

---

**Last Updated:** February 19, 2026

**Data Verification Status:** Ongoing - We continuously verify and update sources
