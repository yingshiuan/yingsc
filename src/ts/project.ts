export interface ProjectMeta {
  title: string;
  subtitle?: string;
  slug: string;
  featured: boolean;
  type: 'demo' | 'Personal' | 'Research' | 'Professional' | string;
  
  created: string | Date;

  domains: string[];
  stack: string[];

  category: string | string[];
  tags: string[];
  image: string;
  hoverImage: string;

  info: string;
  description: string;

  role: string;
  timeline: string;
  completed: string;
  credit: string;
  creditLink?: string;
  tools: string[];
  focus: string[];
  activities: string;
}
