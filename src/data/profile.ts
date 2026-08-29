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
  ],

  roles: [
    {
      title: 'Junior Business Central Analyst',
      org: 'Dukal LLC',
      startYear: 2017,
      period: 'Mar 2025 - Present',
      location: 'Ronkonkama, NY',
      points: [
        'Second-line support across fifteen NAV installations. Learned what breaks in production, which is most of what I write about now.',
      ],
    },
  ] satisfies Role[],

  skills: [
    { label: 'Platforms', items: 'Dynamics 365 Business Central, Power Automate, Sharepoint' },
    { label: 'Languages', items: 'AL, SQL, Python, Java, R' },
    { label: 'EDI', items: 'trading partner onboarding' }
  ],
};
