
export interface ProjectMeta {
  title: string;
  tags: string[];
  image: string;
  hoverImage?: string;
  description: string;
  href?: string;
  order?: number;
  slug?: string;
  type?: 'demo' | 'case-study' | 'personal' | string;
  role?: string;
  timeline?: string;
  completed?: string;
  credit?: string;
  creditLink?: string;
  tools?: string[];
  activities?: string;
}
