export interface SeoData {
  title: string;
  description: string;
  /** Relative (`images/x.png`) or absolute. Head resolves it to an absolute URL. */
  image?: string;
  url?: string;
  keywords?: string[] | string;
  alt?: string;
  /** Keeps the page out of search results. Used by /sitemap. */
  noindex?: boolean;
  /** schema.org @type for the page-level JSON-LD. Defaults to WebPage. */
  schemaType?: string;
}
