export interface ResumeLink {
  href: string;
  label: string;
}

export interface ResumeItem {
  title: string;
  company?: string;
  location?: string;
  link?: string;
  links?: ResumeLink[];
  linkInfo?: string;
  tech?: string[];
  description?: string;
  topics?: string;
  date?: string;
  role?: string;
  level?: string;
  skills?: string[];
}

export interface ResumeData {
  experience: ResumeItem[];
  initiatives: ResumeItem[];
  education: ResumeItem[];
  certification: ResumeItem[];
  skills: ResumeItem[];
  languages: ResumeItem[];
}
