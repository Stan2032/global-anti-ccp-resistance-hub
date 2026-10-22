/**
 * Letter templates for writing to elected representatives, one per topic.
 *
 * Shown in full on /take-action by ContactRepresentatives, and offered as
 * plain-text downloads by ActivistToolkit. Kept here so both say the same.
 *
 * @module letterTemplates
 */
import { STATISTICS } from './statistics';

export interface LetterTemplate {
  subject: string;
  body: string;
}

export const LETTER_TOPICS: { id: string; name: string }[] = [
  { id: 'general', name: 'General Human Rights' },
  { id: 'uyghur', name: 'Uyghur Genocide' },
  { id: 'hongkong', name: 'Hong Kong Freedom' },
  { id: 'tibet', name: 'Tibetan Rights' },
  { id: 'taiwan', name: 'Taiwan Support' },
  { id: 'jimmylai', name: 'Free Jimmy Lai' },
  { id: 'sanctions', name: 'Magnitsky Sanctions' },
];

export const LETTER_TEMPLATES: Record<string, LetterTemplate> = {
  general: {
    subject: 'Urging Action on Human Rights Abuses by the Chinese Communist Party',
    body: `Dear [Representative Name],

I am writing to urge you to take action on the ongoing human rights abuses perpetrated by the Chinese Communist Party (CCP).

The CCP continues to commit serious violations including:
• The detention of ${STATISTICS.uyghurDetention.value} Uyghurs in internment camps since 2017
• The systematic destruction of Hong Kong's autonomy and freedoms
• The persecution of Tibetans, Falun Gong practitioners, and Christians
• Transnational repression targeting diaspora communities worldwide

I urge you to:
1. Support legislation imposing Magnitsky sanctions on CCP officials responsible for human rights abuses
2. Advocate for the release of political prisoners including Jimmy Lai
3. Ensure supply chains are free from forced labor
4. Speak out publicly against CCP human rights violations

As your constituent, I believe our country must stand firmly for human rights and against authoritarian oppression.

Thank you for your attention to this critical issue.

Sincerely,
[Your Name]
[Your Address]`
  },
  uyghur: {
    subject: 'Urgent Action Needed on Uyghur Genocide',
    body: `Dear [Representative Name],

I am writing to urge immediate action on the genocide being committed against the Uyghur people in the Xinjiang Uyghur Autonomous Region of China.

The evidence is overwhelming:
• The detention of ${STATISTICS.uyghurDetention.value} Uyghurs in internment camps since 2017, more than half a million of whom are estimated to be held still
• Forced sterilization and birth prevention
• Systematic cultural and religious destruction
• Forced labor in factories supplying global brands
• Separation of families and "re-education" of children

The UN Human Rights Office has documented these abuses as potential crimes against humanity.

I urge you to:
1. Support the Uyghur Forced Labor Prevention Act and its enforcement
2. Impose Magnitsky sanctions on officials responsible for the genocide
3. Ensure no products made with forced labor enter our markets
4. Advocate for independent UN access to Xinjiang
5. Support Uyghur refugees and asylum seekers

We must not be complicit in genocide through silence or inaction.

Sincerely,
[Your Name]
[Your Address]`
  },
  hongkong: {
    subject: 'Support for Hong Kong Democracy and Freedom',
    body: `Dear [Representative Name],

I am writing to urge continued support for the people of Hong Kong who are fighting for their fundamental freedoms.

Since the imposition of the National Security Law in 2020:
• Over 260 people have been arrested under the NSL
• Independent media has been shut down (Apple Daily, Stand News)
• Pro-democracy legislators have been disqualified and imprisoned
• Civil society organizations have been forced to disband
• The "Hong Kong 47" were sentenced to 4-10 years in prison for organizing a primary election

I urge you to:
1. Support sanctions on officials responsible for suppressing Hong Kong's freedoms
2. Provide pathways for Hong Kongers seeking refuge
3. Advocate for the release of political prisoners including Jimmy Lai
4. Ensure our country does not legitimize the erosion of "One Country, Two Systems"

Hong Kong's fight is a fight for democracy everywhere.

Sincerely,
[Your Name]
[Your Address]`
  },
  tibet: {
    subject: 'Support for Tibetan Rights and Self-Determination',
    body: `Dear [Representative Name],

I am writing to urge action on the ongoing oppression of the Tibetan people by the Chinese Communist Party.

For over 70 years, Tibetans have faced:
• Systematic destruction of religious and cultural heritage
• Arbitrary detention of monks, nuns, and activists
• Forced "patriotic education" and Sinicization
• Environmental destruction of the Tibetan Plateau
• Surveillance and restrictions on movement

The Dalai Lama, now 89 years old, remains in exile while the CCP attempts to control his succession.

I urge you to:
1. Support the Tibetan Policy and Support Act
2. Advocate for dialogue between the CCP and Tibetan representatives
3. Oppose CCP interference in the selection of the next Dalai Lama
4. Support Tibetan refugees and cultural preservation efforts

Tibet's struggle for freedom deserves our solidarity.

Sincerely,
[Your Name]
[Your Address]`
  },
  taiwan: {
    subject: "Support for Taiwan's Democracy and Security",
    body: `Dear [Representative Name],

I am writing to urge strong support for Taiwan, a vibrant democracy facing increasing threats from the Chinese Communist Party.

Taiwan faces daily threats including:
• Military incursions into Taiwan's Air Defense Identification Zone
• Economic coercion and diplomatic isolation campaigns
• Disinformation and influence operations
• Explicit threats of military invasion

Taiwan is a beacon of democracy in Asia with:
• Free and fair elections
• A free press and civil society
• Strong human rights protections
• A thriving high-tech economy

I urge you to:
1. Support Taiwan's meaningful participation in international organizations
2. Strengthen security cooperation and deterrence
3. Expand economic and trade ties with Taiwan
4. Clearly communicate the costs of any military aggression

Taiwan's democracy must be defended.

Sincerely,
[Your Name]
[Your Address]`
  },
  jimmylai: {
    subject: 'Urgent: Free Jimmy Lai - Hong Kong Press Freedom Hero',
    body: `Dear [Representative Name],

I am writing to urge immediate action to secure the release of Jimmy Lai, the 78-year-old Hong Kong media entrepreneur and democracy advocate.

Jimmy Lai:
• Founded Apple Daily, Hong Kong's largest pro-democracy newspaper
• Has been imprisoned since December 2020
• Was just convicted on December 15, 2025 under the National Security Law
• Sentenced to 20 years in prison for exercising press freedom
• Is a British citizen being denied consular access

His "crime" was publishing a newspaper that criticized the Chinese Communist Party.

I urge you to:
1. Publicly call for Jimmy Lai's immediate release
2. Impose sanctions on officials responsible for his prosecution
3. Raise his case in all bilateral discussions with China
4. Support his family's advocacy efforts

Jimmy Lai's imprisonment is an attack on press freedom worldwide.

Sincerely,
[Your Name]
[Your Address]`
  },
  sanctions: {
    subject: 'Support Magnitsky Sanctions on CCP Human Rights Abusers',
    body: `Dear [Representative Name],

I am writing to urge the use of Magnitsky sanctions against Chinese Communist Party officials responsible for human rights abuses.

Officials who should face sanctions include those responsible for:
• The Uyghur genocide and forced labor system
• The destruction of Hong Kong's autonomy
• Transnational repression operations (overseas police stations)
• The persecution of political prisoners
• Religious persecution of Tibetans, Christians, and Falun Gong

Magnitsky sanctions are an effective tool because they:
• Target individual perpetrators, not the Chinese people
• Freeze assets and ban travel to democratic countries
• Send a clear message that human rights abusers will face consequences
• Create a deterrent for future abuses

I urge you to:
1. Support expanded use of Global Magnitsky sanctions
2. Advocate for coordinated sanctions with allies
3. Ensure robust enforcement of existing sanctions
4. Publicly name officials responsible for abuses

Accountability is essential to defending human rights.

Sincerely,
[Your Name]
[Your Address]`
  }
};

/** The letter as one plain-text document: subject line, then body. */
export function letterAsText(id: string): string {
  const letter = LETTER_TEMPLATES[id];
  return letter ? `Subject: ${letter.subject}\n\n${letter.body}\n` : '';
}
