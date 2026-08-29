// Your professional profile. The /about page renders this, and printing that
// page produces the PDF — one source, never two versions that drift.

export interface Role {
  title: string;
  org: string;
  startYear: number;
  period: string;
  location?: string;
  points: string[];
}

export const profile = {
  summary:
    'Business Central consultant and developer. I spend most of my time on the seams between systems: EDI document flows, Power Automate orchestration, and the integrations that have to keep running at 3am.',

  // Shown as a short list on /about. Certifications carry real weight in this
  // ecosystem, so they sit above experience.
  certifications: [
    { name: 'MB-820: Business Central Developer', year: 2025 },
    { name: 'MB-800: Business Central Functional Consultant', year: 2023 },
    { name: 'PL-400: Power Platform Developer', year: 2022 },
  ],

  roles: [
    {
      title: 'Senior Business Central Consultant',
      org: 'Northwind Partners',
      startYear: 2023,
      period: '2023 — Present',
      location: 'Remote',
      points: [
        'Lead EDI implementations for wholesale and distribution clients, covering 850/855/856/810 flows with a dozen trading partners.',
        'Built the AL extension framework the team now reuses on every EDI engagement, cutting typical setup from six weeks to two.',
        'Own the Power Automate layer that moves documents between Business Central, SharePoint, and partner AS2 endpoints.',
      ],
    },
    {
      title: 'Business Central Developer',
      org: 'Calder & Roe',
      startYear: 2020,
      period: '2020 — 2023',
      location: 'New York, NY',
      points: [
        'Migrated three clients from NAV 2018 to Business Central online, including full rewrites of legacy C/AL customisations into AL extensions.',
        'Designed the Dataverse sync used by the sales team to work leads without touching BC directly.',
      ],
    },
    {
      title: 'NAV Support Analyst',
      org: 'Harbour Systems',
      startYear: 2017,
      period: '2017 — 2020',
      location: 'New York, NY',
      points: [
        'Second-line support across fifteen NAV installations. Learned what breaks in production, which is most of what I write about now.',
      ],
    },
  ] satisfies Role[],

  skills: [
    { label: 'Platforms', items: 'Dynamics 365 Business Central, NAV, Dataverse, Power Platform' },
    { label: 'Languages', items: 'AL, C/AL, C#, TypeScript, SQL, XSLT' },
    { label: 'EDI', items: 'X12, EDIFACT, AS2, SFTP, trading partner onboarding' },
    { label: 'Integration', items: 'Azure Functions, Logic Apps, Service Bus, REST/OData APIs' },
  ],
};
