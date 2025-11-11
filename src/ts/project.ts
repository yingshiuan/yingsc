
export interface ProjectMeta {
  title: string;
  order?: number;
  category?: string;
  tags: string[];
  image: string;
  hoverImage?: string;
  info: string;
  description: string;
  href?: string;
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
