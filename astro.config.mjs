// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  site: "https://yingshiuan.github.io",
  // repo name
  base: "/yingsc/",
  integrations: [
    sitemap({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter: (page) => true,
    }),
    partytown({
        config: {
          forward: ["dataLayer.push"],
        },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
