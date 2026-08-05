# Ying-Shiuan Chen — Portfolio

Personal portfolio site of a Product Engineer working across AI systems, interactive interfaces, and spatial computing.

**Live:** <https://yingshiuan.github.io/yingsc/>

Built with [Astro](https://astro.build/) as a static site: content lives in Markdown, pages ship as plain HTML, and JavaScript is added only where a page actually needs it.

## What's inside

- **Project case studies** — each project is a Markdown file with co-located images, validated by a typed content schema
- **Resume** — a single `resume.json` drives the homepage experience section, the `/resume` page, and the structured data
- **Light / dark / system theme**, remembered across visits
- **SEO & AEO** — per-page meta and Open Graph tags, plus schema.org JSON-LD (one `Person` entity generated from the resume, so it can't drift)
- **Automatic sitemap** and a human-readable `/sitemap` page

## Tech stack

| | |
|---|---|
| [Astro](https://astro.build/) 7 | Static site framework, content collections |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling, via `@tailwindcss/vite` |
| [TypeScript](https://www.typescriptlang.org/) | Types for content, resume data and SEO props |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | Sitemap generation at build time |
| [@astrojs/partytown](https://docs.astro.build/en/guides/integrations-guide/partytown/) | Runs analytics off the main thread |
| ESLint + Prettier | Linting and formatting |

Exact versions live in [`package.json`](./package.json).

## Project structure

```
src/
├── content/            Markdown + JSON content (projects, about, intro, resume)
├── content.config.ts   Content collection schemas
├── pages/              Routes — one file per page, [id].astro for projects
├── layouts/            Page shell
├── components/         layout/ · grids/ · content/ · UI/
├── styles/global.css   Design tokens and base typography
└── ts/                 Shared types and helpers
public/                 Files served as-is: images, resume PDF, favicons
docs/                   Handbook for maintaining the site
```

Adding a project means creating `src/content/projects/<slug>/index.md` with its
images beside it — the folder name becomes the URL. No components to touch.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages. There is no separate
release step.

Deploying your own Astro site this way:
[Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).

## Documentation

[`docs/`](./docs/README.md) is the handbook for this site — running it locally,
adding a project, what to write on each page, and how the code fits together.

## Author

[Ying-Shiuan Chen](https://github.com/yingshiuan/) ·
[LinkedIn](https://www.linkedin.com/in/chenyingshiuan/)

## License

MIT — see [LICENSE](./LICENSE).
