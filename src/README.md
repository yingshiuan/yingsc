# Maintenance Notes

My own notes. Full handbook: [`docs/`](../docs/README.md)

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server → <http://localhost:4321/yingsc/> (the `/yingsc/` path matters) |
| `npm run build` | Static build into `dist/` — must pass before pushing |
| `npm run preview` | Serve `dist/` exactly as it will be deployed |
| `npm run check` | `astro check` — types + template errors |
| `npm run lint` | ESLint across `.ts`, `.js`, `.astro` |
| `npx eslint . --fix` | Auto-fix the fixable lint errors |

Push to `main` = deploy. GitHub Actions builds and publishes to Pages.

## To-Do List / Roadmap

- [ ] ToDoListAddHere
- [ ] ToDoListAddHere

## Notes

**Analytics are already set up** — GA4 `G-XPJ7PBRN07` and GTM `GTM-MZKP489Z`
live in `src/components/layout/Head.astro`, both wrapped in
`import.meta.env.PROD` so they only run in production builds, never in `dev`.
To change the IDs, edit that file. `layout/AnalyticsStub.astro` is an unused
consent-denied variant.

**Before publishing:** delete the placeholder projects
`src/content/projects/demo/` and `src/content/projects/arvr/` — they build to
real pages with dummy copy.

## Commit Message Prefixes

| Prefix      | When to use                                            | Example                                         |
|------------|-------------------------------------------------------|------------------------------------------------|
| **feat:**  | A new feature                                        | `feat: add backend skeleton`                  |
| **fix:**   | A bug fix                                            | `fix: correct typo in README`                 |
| **content:** | New or edited site content (projects, notes, resume) | `content: add MenuGen case study`            |
| **docs:**  | Documentation changes only                           | `docs: update README with project features`  |
| **style:** | Formatting, spacing, or code style (no logic change)| `style: format main.py with black`           |
| **refactor:** | Code refactoring (no feature, no bug fix)         | `refactor: split API routes into separate file`|
| **test:**  | Adding or updating tests                             | `test: add unit tests for Note model`        |
| **chore:** | Build process, tooling, or miscellaneous maintenance | `chore: update .gitignore and package.json`  |
| **perf:**  | Performance improvements                             | `perf: optimize database queries in backend` |
| **ci:**    | Continuous integration / deployment changes          | `ci: add GitHub Actions workflow`            |
| **typo:**  | Fix typos in docs, comments, or strings             | `typo: fix spelling in README`               |
