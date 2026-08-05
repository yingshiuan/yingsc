import type { ResumeData, ResumeItem } from '@/ts/resume';

const MONTHS: Record<string, string> = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
};

/**
 * schema.org dates must be ISO 8601, so "Feb 2025" is silently ignored by
 * crawlers. Converts the human formats used in resume.json:
 *   "Feb 2025" -> "2025-02"   "July 2024" -> "2024-07"   "2018" -> "2018"
 * Anything unparseable (or "Present") returns undefined so the field is
 * omitted rather than emitted as junk.
 */
export function toIsoDate(value?: string): string | undefined {
  const text = value?.trim();
  if (!text || /^(present|now|current|ongoing|today)$/i.test(text))
    return undefined;

  if (/^\d{4}$/.test(text)) return text;
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(text)) return text;

  const monthYear = text.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTHS[monthYear[1].slice(0, 3).toLowerCase()];
    if (month) return `${monthYear[2]}-${month}`;
  }

  return undefined;
}

/**
 * Splits a resume date range on any dash — resume.json mixes en dashes
 * ("Feb 2025 – Aug 2025") and hyphens ("2012 - 2017").
 */
export function toIsoRange(range?: string): {
  startDate?: string;
  endDate?: string;
} {
  if (!range) return {};
  const [start, end] = range.split(/\s*[–—-]\s*/);
  return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
}

export interface PersonInput {
  /** Stable @id so every reference across the site resolves to one entity. */
  personId: string;
  url: string;
  image?: string;
  name?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}

export const DEFAULT_PERSON_DESCRIPTION =
  'Product Engineer building AI-powered applications, spatial computing experiences, and human-centered software through full-stack engineering, interaction design, and rapid prototyping.';

export const DEFAULT_SAME_AS = [
  'https://www.linkedin.com/in/chenyingshiuan/',
  'https://github.com/yingshiuan',
  'https://yingshiuan.github.io/yshiuanc/',
];

/**
 * The single Person entity for the site, generated from resume.json so the
 * structured data can't drift from the resume itself.
 */
export function buildPerson(resumeData: ResumeData, input: PersonInput) {
  const {
    personId,
    url,
    image,
    name = 'Ying-Shiuan Chen',
    jobTitle = 'Product Engineer',
    description = DEFAULT_PERSON_DESCRIPTION,
    sameAs = DEFAULT_SAME_AS,
  } = input;

  const currentRole = resumeData.experience?.[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name,
    description,
    url,
    image,
    jobTitle,
    sameAs,
    worksFor: currentRole?.company
      ? {
          '@type': 'Organization',
          name: currentRole.company,
          url: currentRole.link,
        }
      : undefined,
    hasOccupation: resumeData.experience?.map((item: ResumeItem) => ({
      '@type': 'Occupation',
      name: item.title,
      description: item.linkInfo ?? '',
      ...toIsoRange(item.date),
      occupationLocation: item.location
        ? { '@type': 'Place', name: item.location }
        : undefined,
      skills: item.tech ?? undefined,
      employer: item.company
        ? {
            '@type': 'Organization',
            name: item.company,
            url: item.link ?? undefined,
          }
        : undefined,
    })),
    knowsAbout:
      resumeData.skills?.flatMap((s: ResumeItem) => s.skills ?? []) ?? [],
    knowsLanguage: resumeData.languages?.map((l: ResumeItem) => l.title) ?? [],
    alumniOf: resumeData.education?.map((edu: ResumeItem) => ({
      '@type': 'EducationalOrganization',
      name: edu.company,
      sameAs: edu.link ?? undefined,
      ...toIsoRange(edu.date),
    })),
    hasCredential: resumeData.certification?.map((cert: ResumeItem) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.title,
      credentialCategory: 'Certificate',
      url: cert.link ?? undefined,
      ...toIsoRange(cert.date),
    })),
  };
}
