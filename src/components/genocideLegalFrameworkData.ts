/**
 * Genocide legal framework data — categories, documented violations,
 * and genocide recognition records for international law analysis.
 *
 * @module genocideLegalFrameworkData
 */
export interface LegalCategory {
  id: string;
  label: string;
  color?: string;
  desc?: string;
}

export const LEGAL_CATEGORIES: LegalCategory[] = [
  { id: 'all', label: 'All Instruments' },
  { id: 'genocide', label: 'Genocide Convention', color: 'text-red-400', desc: 'UN Convention on the Prevention and Punishment of the Crime of Genocide (1948)' },
  { id: 'torture', label: 'Convention against Torture', color: 'text-orange-400', desc: 'UN Convention against Torture and Other Cruel, Inhuman or Degrading Treatment (1984)' },
  { id: 'iccpr', label: 'ICCPR', color: 'text-yellow-400', desc: 'International Covenant on Civil and Political Rights (1966)' },
  { id: 'forced_labor', label: 'Forced Labor Conventions', color: 'text-[#a78bfa]', desc: 'ILO Forced Labour Convention (No. 29, 1930) and Abolition of Forced Labour Convention (No. 105, 1957)' },
  { id: 'minority_rights', label: 'Minority Rights', color: 'text-[#22d3ee]', desc: 'UN Declaration on the Rights of Persons Belonging to National or Ethnic, Religious and Linguistic Minorities (1992)' },
];

export interface RecognitionCountry {
  country: string;
  year: number;
  body: string;
  type: string;
  details: string;
}

export const RECOGNITION_COUNTRIES: RecognitionCountry[] = [
  { country: 'United States', year: 2021, body: 'US State Department', type: 'Genocide declaration', details: 'Secretary Pompeo declared genocide (Jan 2021), reaffirmed by Biden admin' },
  { country: 'Canada', year: 2021, body: 'House of Commons', type: 'Parliamentary motion', details: 'Passed non-binding motion recognizing genocide (Feb 2021, 266-0)' },
  { country: 'Netherlands', year: 2021, body: 'House of Representatives', type: 'Parliamentary motion', details: 'First European parliament to recognize genocide (Feb 2021)' },
  { country: 'United Kingdom', year: 2021, body: 'House of Commons', type: 'Parliamentary motion', details: 'Declared genocide in Xinjiang (Apr 2021), rejected by government' },
  { country: 'Lithuania', year: 2021, body: 'Seimas (Parliament)', type: 'Parliamentary resolution', details: 'Recognized genocide in Xinjiang (May 2021)' },
  { country: 'Czech Republic', year: 2021, body: 'Senate', type: 'Senate resolution', details: 'Adopted resolution recognizing genocide (Jun 2021)' },
  { country: 'Belgium', year: 2021, body: 'Parliament', type: 'Parliamentary resolution', details: 'Recognized "serious risk of genocide" (Jun 2021)' },
  { country: 'France', year: 2022, body: 'National Assembly', type: 'Parliamentary resolution', details: 'Recognized genocide and crimes against humanity (Jan 2022)' },
  { country: 'Uyghur Tribunal', year: 2021, body: 'Independent people\'s tribunal', type: 'Tribunal judgment', details: 'Sir Geoffrey Nice QC: genocide established beyond reasonable doubt (Dec 2021)' },
  { country: 'China Tribunal', year: 2019, body: 'Independent people\'s tribunal', type: 'Tribunal judgment', details: 'Sir Geoffrey Nice QC: forced organ harvesting proven beyond reasonable doubt' },
];
