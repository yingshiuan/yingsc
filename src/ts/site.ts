// Tag IDs for the analytics stack, kept here rather than inline in
// Layout.astro so the privacy page and the layout name the same property
// instead of drifting apart — the cookie table on /privacy is written from
// `measurementId`, and a stale copy there is a factually wrong policy.
//
// These are public identifiers: they ship in the page source of every build
// and are not secrets. Nothing here belongs in an env var.
export const analytics = {
  /** GA4 measurement ID. Omit to disable GA4. */
  measurementId: 'G-XPJ7PBRN07',
  /** GTM container ID. Omit to disable GTM. */
  gtmId: 'GTM-MZKP489Z',
} as const;

// How long each piece of the analytics setup lives. Only `consent` is enforced
// by code — it mirrors MAX_AGE in Analytics.astro, and the two have to move
// together. The other two are stated here so /privacy has one source for them.
export const retention = {
  /**
   * GA4 event-data retention. A console setting this repo cannot apply:
   * Admin -> Data Settings -> Data Retention on the property above. Standard
   * properties offer 2 months or 14. Change this when that dropdown changes,
   * or /privacy claims something the property does not do.
   */
  events: '2 months',
  /** Lifetime of the `_ga` cookies GA4 writes once consent is granted. */
  cookies: '2 years',
  /** How long a stored Accept/Reject stands before the bar asks again. */
  consent: '6 months',
} as const;
