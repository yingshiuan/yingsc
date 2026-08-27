// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://yingshiuan.github.io",
  // repo name
  base: "/yingsc/",
  // GA4 and GTM both run on the main thread. Partytown used to host GA4, but
  // consent updates could not cross the worker boundary, and its
  // `forward: ["dataLayer.push"]` replaced the shared dataLayer push globally —
  // which also stopped main-thread GTM from seeing its own events. The package
  // is still installed so re-adding the integration here is a two-line revert.
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
