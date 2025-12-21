# Wide Research Plan for Global Anti-CCP Resistance Hub

This document outlines structured research tasks optimized for parallel execution using Wide Research mode.

---

## Research Task 1: Political Prisoners Database Update

### Objective
Verify and update information on all documented political prisoners, adding new cases and current status.

### Input List (57+ prisoners to research)
```
1. Jimmy Lai (Hong Kong media owner)
2. Ilham Tohti (Uyghur economist)
3. Gao Zhisheng (Human rights lawyer)
4. Zhang Zhan (Citizen journalist)
5. Huang Qi (64 Tianwang founder)
6. Wang Quanzhang (709 lawyer)
7. Xu Zhiyong (Legal activist)
8. Ding Jiaxi (Human rights lawyer)
9. Chow Hang-tung (HK activist)
10. Joshua Wong (HK activist)
11. Agnes Chow (HK activist)
12. Nathan Law (HK activist - exile)
13. Benny Tai (HK academic)
14. Martin Lee (HK democracy founder)
15. Cardinal Zen (HK religious leader)
16. Gui Minhai (Bookseller)
17. Lee Bo (Bookseller)
18. Gedhun Choekyi Nyima (Panchen Lama)
19. Tashi Wangchuk (Tibetan activist)
20. Rinchen Tsultrim (Tibetan monk)
21. Go Sherab Gyatso (Tibetan monk)
22. Jiang Tianyong (Human rights lawyer)
23. Li Yuhan (Human rights lawyer)
24. Yu Wensheng (Human rights lawyer)
25. Chen Mei (COVID activist)
26. Cai Wei (COVID activist)
27. Li Qiaochu (Feminist activist)
28. Sophia Huang Xueqin (MeToo journalist)
29. Wang Jianbing (Labor activist)
30. Chang Weiping (Human rights lawyer)
31. Pu Zhiqiang (Human rights lawyer)
32. Liu Feiyue (Civil Rights activist)
33. Wu Gan (Online activist)
34. Qin Yongmin (Democracy activist)
35. Liu Xia (Liu Xiaobo's widow)
36. Hada (Mongolian activist)
37. Tenzin Nyima (Tibetan monk)
38. Lobsang Lhundup (Tibetan monk)
39. Ekpar Asat (Uyghur entrepreneur)
40. Rahile Dawut (Uyghur scholar)
41. Abdurahman Hasan (Uyghur religious leader)
42. Yalqun Rozi (Uyghur publisher)
43. Nurmuhammad Tohti (Uyghur businessman)
44. Perhat Tursun (Uyghur poet)
45. Abduweli Ayup (Uyghur linguist - released)
46. Rushan Abbas' sister (Uyghur doctor)
47. Jewher Ilham's father (Ilham Tohti)
48. Andy Li (HK 12)
49. Owen Chow (HK activist)
50. Gwyneth Ho (HK journalist)
51. Claudia Mo (HK legislator)
52. Leung Kwok-hung (Long Hair)
53. Jimmy Sham (HK activist)
54. Lee Cheuk-yan (HK labor leader)
55. Tam Tak-chi (HK activist)
56. Tony Chung (HK student activist)
57. Ma Jian (Uyghur football player)
58. Xin Ruoyu (Young mother - black jail)
59. Guan Heng (Citizen journalist)
60. Ren Zhiqiang (CCP critic businessman)
```

### Output Schema per Prisoner
```json
{
  "name": "string - Full name",
  "chinese_name": "string - Chinese characters if applicable",
  "status": "string - DETAINED/RELEASED/DISAPPEARED/DECEASED/EXILE/AT RISK",
  "current_location": "string - Prison name or location",
  "sentence": "string - Length and charges",
  "detention_date": "string - YYYY-MM-DD",
  "release_date": "string - YYYY-MM-DD or null",
  "latest_news": "string - Most recent development",
  "news_date": "string - YYYY-MM-DD",
  "health_status": "string - Known health conditions",
  "international_response": "string - Government statements, awards",
  "source_url": "string - Primary source URL",
  "confidence": "string - HIGH/MEDIUM/LOW"
}
```

---

## Research Task 2: Confucius Institutes by Country

### Objective
Document Confucius Institutes status in 50+ countries - closures, investigations, current operations.

### Input List (50 countries)
```
1. United States
2. United Kingdom
3. Canada
4. Australia
5. Germany
6. France
7. Japan
8. South Korea
9. Netherlands
10. Sweden
11. Belgium
12. Italy
13. Spain
14. Portugal
15. Austria
16. Switzerland
17. Denmark
18. Norway
19. Finland
20. Ireland
21. New Zealand
22. India
23. Brazil
24. Mexico
25. Argentina
26. South Africa
27. Nigeria
28. Kenya
29. Egypt
30. Israel
31. Turkey
32. Russia
33. Poland
34. Czech Republic
35. Hungary
36. Romania
37. Greece
38. Thailand
39. Indonesia
40. Malaysia
41. Philippines
42. Vietnam
43. Pakistan
44. Bangladesh
45. Sri Lanka
46. Nepal
47. Singapore
48. Taiwan
49. Chile
50. Colombia
```

### Output Schema per Country
```json
{
  "country": "string - Country name",
  "total_institutes": "number - Total CIs ever established",
  "currently_open": "number - Currently operating",
  "closed": "number - Permanently closed",
  "under_investigation": "number - Under government review",
  "notable_closures": "string - Names of closed CIs",
  "closure_reasons": "string - Why closed (espionage, influence, etc.)",
  "government_action": "string - Official government stance",
  "universities_with_ci": "string - List of universities",
  "latest_news": "string - Most recent development",
  "news_date": "string - YYYY-MM-DD",
  "source_url": "string - Primary source URL"
}
```

---

## Research Task 3: Overseas Police Stations Status

### Objective
Verify current status of all 102+ documented CCP overseas police stations.

### Input List (Countries with police stations)
```
1. United Kingdom (multiple locations)
2. Netherlands (Amsterdam, Rotterdam)
3. Canada (Toronto, Vancouver)
4. United States (New York, Los Angeles)
5. Ireland (Dublin)
6. France (Paris)
7. Germany (multiple)
8. Spain (Madrid, Barcelona)
9. Italy (Rome, Milan)
10. Portugal (Lisbon)
11. Hungary (Budapest)
12. Czech Republic (Prague)
13. Croatia (Zagreb)
14. Serbia (Belgrade)
15. Romania (Bucharest)
16. Greece (Athens)
17. Japan (Tokyo)
18. South Korea (Seoul)
19. Australia (Sydney, Melbourne)
20. New Zealand (Auckland)
21. Brazil (São Paulo)
22. Argentina (Buenos Aires)
23. South Africa (Johannesburg)
24. Nigeria (Lagos)
25. Kenya (Nairobi)
26. Tanzania (Dar es Salaam)
27. Thailand (Bangkok)
28. Cambodia (Phnom Penh)
29. Indonesia (Jakarta)
30. Malaysia (Kuala Lumpur)
```

### Output Schema per Location
```json
{
  "country": "string - Country name",
  "city": "string - City name",
  "address": "string - Known address if available",
  "status": "string - CLOSED/UNDER INVESTIGATION/OPERATING/UNKNOWN",
  "closure_date": "string - YYYY-MM-DD if closed",
  "arrests_made": "boolean - Were arrests made",
  "arrest_details": "string - Details of any arrests",
  "government_response": "string - Official government action",
  "linked_to": "string - Fuzhou or Qingtian police",
  "evidence": "string - Type of evidence (Safeguard Defenders, local investigation)",
  "latest_news": "string - Most recent development",
  "source_url": "string - Primary source URL"
}
```

---

## Research Task 4: Human Rights Organizations

### Objective
Compile comprehensive database of organizations working on China human rights.

### Input List (50 organizations)
```
1. Uyghur Human Rights Project (UHRP)
2. Campaign for Uyghurs
3. World Uyghur Congress
4. Uyghur American Association
5. Hong Kong Watch
6. Committee for Freedom in Hong Kong Foundation
7. Hong Kong Democracy Council
8. Stand with Hong Kong
9. International Campaign for Tibet
10. Tibet Action Institute
11. Students for a Free Tibet
12. Free Tibet
13. International Tibet Network
14. Safeguard Defenders
15. Chinese Human Rights Defenders
16. China Aid
17. Citizen Power Initiatives for China
18. Human Rights in China
19. Laogai Research Foundation
20. Dui Hua Foundation
21. Front Line Defenders
22. Amnesty International (China)
23. Human Rights Watch (China)
24. Freedom House (China)
25. Reporters Without Borders (China)
26. Committee to Protect Journalists (China)
27. PEN International (China)
28. International Federation for Human Rights
29. Unrepresented Nations and Peoples Organization
30. Taiwan Foundation for Democracy
31. Taiwan Association for Human Rights
32. Southern Mongolian Human Rights Information Center
33. Inner Mongolian People's Party
34. Falun Dafa Information Center
35. China Tribunal
36. Coalition to End Transplant Abuse in China
37. Victims of Communism Memorial Foundation
38. National Endowment for Democracy (China programs)
39. Radio Free Asia
40. Voice of America (Chinese)
41. Hong Kong Free Press
42. The China Project
43. ChinaFile
44. SupChina
45. Bitter Winter
46. AsiaNews
47. Xinjiang Victims Database
48. Xinjiang Police Files
49. Australian Strategic Policy Institute (China)
50. Center for Strategic and International Studies (China)
```

### Output Schema per Organization
```json
{
  "name": "string - Organization name",
  "acronym": "string - Common acronym",
  "type": "string - NGO/Media/Research/Advocacy/Legal",
  "focus_areas": "string - Uyghur/HK/Tibet/General/Media",
  "headquarters": "string - City, Country",
  "founded": "number - Year founded",
  "website": "string - Official website URL",
  "donate_url": "string - Donation page URL",
  "social_media": "string - Twitter/X handle",
  "key_reports": "string - Notable publications",
  "leadership": "string - Executive Director/President",
  "credibility": "string - HIGH/MEDIUM - based on citations",
  "description": "string - Brief description of work"
}
```

---

## Research Task 5: Sanctioned CCP Officials

### Objective
Compile complete list of CCP officials sanctioned by Western governments.

### Input List (Officials to research)
```
1. Chen Quanguo (Xinjiang Party Secretary)
2. Zhu Hailun (Xinjiang Security)
3. Wang Junzheng (Xinjiang XPCC)
4. Wang Mingshan (Xinjiang Public Security)
5. Huo Liujun (Xinjiang Prison Admin)
6. Carrie Lam (HK Chief Executive)
7. John Lee (HK Chief Executive)
8. Teresa Cheng (HK Justice Secretary)
9. Chris Tang (HK Police Commissioner)
10. Stephen Lo (Former HK Police)
11. Erick Tsang (HK Secretary)
12. Xia Baolong (HK Affairs)
13. Zhang Xiaoming (HK Affairs)
14. Luo Huining (Liaison Office)
15. Zheng Yanxiong (National Security)
16. Eric Chan (HK Chief Secretary)
17. Paul Lam (HK Justice Secretary)
18. Raymond Siu (HK Police)
19. Frederic Choi (HK National Security)
20. Li Jiangzhou (HK Immigration)
```

### Output Schema per Official
```json
{
  "name": "string - Full name",
  "chinese_name": "string - Chinese characters",
  "position": "string - Current/former position",
  "region": "string - Xinjiang/Hong Kong/Tibet/Central",
  "sanctioned_by_us": "boolean",
  "sanctioned_by_uk": "boolean",
  "sanctioned_by_eu": "boolean",
  "sanctioned_by_canada": "boolean",
  "sanctioned_by_australia": "boolean",
  "sanction_date": "string - First sanction date",
  "sanction_type": "string - Asset freeze/travel ban/both",
  "reason": "string - Official reason for sanctions",
  "key_actions": "string - What they did",
  "current_status": "string - Still in position/retired/promoted",
  "source_url": "string - Official sanctions list URL"
}
```

---

## Research Task 6: Detention Facilities Expansion

### Objective
Expand detention facility database with satellite coordinates and latest evidence.

### Input List (Regions to research)
```
1. Xinjiang - Ürümqi
2. Xinjiang - Kashgar
3. Xinjiang - Hotan
4. Xinjiang - Aksu
5. Xinjiang - Korla
6. Xinjiang - Turpan
7. Xinjiang - Altay
8. Xinjiang - Karamay
9. Xinjiang - Yining
10. Xinjiang - Shihezi
11. Tibet - Lhasa
12. Tibet - Shigatse
13. Tibet - Chamdo
14. Tibet - Nyingchi
15. Inner Mongolia - Hohhot
16. Inner Mongolia - Baotou
17. Qinghai - Xining
18. Gansu - Lanzhou
19. Sichuan - Chengdu (Tibetan areas)
20. Beijing - Qincheng
```

### Output Schema per Region
```json
{
  "region": "string - Province/Region",
  "city": "string - City name",
  "facility_count": "number - Known facilities",
  "facility_names": "string - Names of facilities",
  "estimated_capacity": "number - Total estimated capacity",
  "satellite_evidence": "boolean - Satellite imagery available",
  "aspi_documented": "boolean - In ASPI database",
  "coordinates": "string - Lat/Long if known",
  "facility_type": "string - Camp/Prison/Black Jail",
  "latest_evidence": "string - Most recent documentation",
  "source_url": "string - ASPI or other source URL"
}
```

---

## Research Task 7: Recent News by Topic (Last 30 Days)

### Objective
Gather latest news developments across all major topics.

### Input List (Topics)
```
1. Jimmy Lai trial updates
2. Hong Kong 47 sentencing appeals
3. Uyghur forced labor UFLPA enforcement
4. Xinjiang sanctions updates
5. Overseas police station investigations
6. Confucius Institute closures
7. Taiwan-China tensions
8. Tibet protests and arrests
9. Chinese dissident news
10. Transnational repression cases
11. Hong Kong NSL prosecutions
12. Uyghur genocide recognition
13. CCP influence operations
14. Chinese journalist arrests
15. Religious persecution China
16. Organ harvesting evidence
17. Belt and Road human rights
18. Chinese tech surveillance
19. Hong Kong media freedom
20. Tibetan self-immolations
```

### Output Schema per Topic
```json
{
  "topic": "string - Topic name",
  "headline": "string - Most important recent headline",
  "summary": "string - 2-3 sentence summary",
  "date": "string - YYYY-MM-DD",
  "source": "string - News source name",
  "source_url": "string - Article URL",
  "significance": "string - HIGH/MEDIUM/LOW",
  "related_prisoners": "string - Names if applicable",
  "international_response": "string - Government reactions",
  "action_needed": "string - What activists can do"
}
```

---

## Execution Priority

When Wide Research is enabled, execute in this order:

### Priority 1 (Most Critical)
1. **Political Prisoners Update** - 60 parallel subtasks
2. **Recent News by Topic** - 20 parallel subtasks

### Priority 2 (High Value)
3. **Overseas Police Stations** - 30 parallel subtasks
4. **Sanctioned Officials** - 20 parallel subtasks

### Priority 3 (Database Expansion)
5. **Confucius Institutes** - 50 parallel subtasks
6. **Human Rights Organizations** - 50 parallel subtasks

### Priority 4 (Deep Research)
7. **Detention Facilities** - 20 parallel subtasks

---

## Expected Outcomes

After Wide Research execution:
- **300+ verified data points** updated
- **Political prisoners database** fully current
- **Confucius Institute tracker** with 50 countries
- **Police station map** with closure status
- **Complete sanctions database**
- **Fresh news content** for all topics

---

## Notes for Execution

1. Each subtask should search for the most recent, credible sources
2. Prioritize official government sources, major news outlets, and established NGOs
3. Cross-reference multiple sources where possible
4. Flag any conflicting information for manual review
5. Include confidence levels in all outputs
