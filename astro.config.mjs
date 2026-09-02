// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const SITE = "https://yingshiuan.github.io";
const BASE = "/yingsc/";

/**
 * Sends links that leave the site to a new tab. Markdown has no syntax for
 * link attributes, so the rule is applied to the rendered tree rather than
 * written out by hand at every `[text](url)`. Anchors authored directly in
 * `.astro` components set their own `target` and are untouched by this.
 *
 * `rel="noopener noreferrer"` travels with `target="_blank"`: without it the
 * opened page gets a handle on this one through `window.opener`.
 *
 * @returns {(tree: any) => void}
 */
function rehypeExternalLinks() {
  const origin = new URL(SITE).origin;

  /** @param {any} node */
  const visit = (node) => {
    if (node.type !== "element" && node.type !== "text" && node.type !== "root")
      console.error("NODETYPE:", node.type, JSON.stringify(String(node.value ?? "").slice(0, 70)));
    if (node.tagName === "a" && typeof node.properties?.href === "string") {
      const href = node.properties.href;
      // Protocol-relative URLs are external too; mailto: and tel: hand off to
      // another application, where a new tab would only leave a blank one open.
      const isHttp = /^(https?:)?\/\//i.test(href);
      if (isHttp && !href.startsWith(origin)) {
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";
      }
    }
    node.children?.forEach(visit);
  };

  return visit;
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // repo name
  base: BASE,
  // GA4 and GTM both run on the main thread. Partytown used to host GA4, but
  // consent updates could not cross the worker boundary, and its
  // `forward: ["dataLayer.push"]` replaced the shared dataLayer push globally —
  // which also stopped main-thread GTM from seeing its own events. The package
  // is still installed so re-adding the integration here is a two-line revert.
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeExternalLinks],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
