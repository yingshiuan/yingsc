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
| `npx playwright test` | Browser tests — **stop the dev server first**, see below |

Push to `main` = deploy. GitHub Actions builds and publishes to Pages.

## The dev server and the tests fight over port 4321

Both want the same port. `playwright.config.ts` sets `PORT = 4321` with
`reuseExistingServer`, which means:

> If a dev server is running, Playwright silently uses **it** instead of building
> and serving `dist/`. The consent tests then fail for the wrong reason — GA4
> never loads in `dev`, so there is no `dataLayer` to assert on, and the run
> takes minutes instead of seconds.

So the loop is:

```sh
npx astro dev stop        # before testing
npx playwright test
PUBLIC_CONSENT_PREVIEW=true npm run dev   # start it again after
```

Forgetting the last line is why the site "disappears" from localhost.

### `astro dev` is a background daemon

`npm run dev` detaches and keeps running after the terminal closes. A second
`npm run dev` does **not** start a new server — it prints
`Dev server already running` and attaches to the existing one, which means **any
env var you just added is ignored**. Change `PUBLIC_CONSENT_PREVIEW`? Stop and
start, don't just re-run.

| Command | What it does |
|---|---|
| `npx astro dev status` | Is one running, and on which pid |
| `npx astro dev stop` | Stop it |
| `npx astro dev logs` | Its output, since it isn't in your terminal |

**Stale records happen.** `status` can report a pid with an uptime while nothing
is actually listening — `curl` returns `000` and the browser cannot connect. A
`npm run dev` in that state attaches to the phantom and exits immediately. Run
`npx astro dev stop` to clear the record, then start normally.

Quick triage when localhost will not load:

```sh
npx astro dev status                                   # claims one is running?
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4321/yingsc/
# 200 = fine · 000 = nothing listening, stale record → astro dev stop
```

## To-Do List / Roadmap

- [ ] ToDoListAddHere
- [ ] ToDoListAddHere

## Notes

**Analytics are already set up** — GA4 `G-XPJ7PBRN07` and GTM
`GTM-MZKP489Z` both live in `src/components/layout/Analytics.astro`, mounted
once from `Layout.astro`. The component gates itself on `import.meta.env.PROD`,
so it only runs in production builds, never in `dev`.

To change the IDs, edit the `measurementId` / `gtmId` props at the
`<Analytics />` call in `src/layouts/Layout.astro`. Don't add a gtag or GTM
snippet anywhere else — a second `gtag('config', ...)` double-counts pageviews.

The consent bar is on (`requireConsent={true}`), so GA4 loads with
`analytics_storage` denied via Consent Mode until the visitor accepts. Set it to
`false` to skip the bar and load with storage granted.

It is deliberately **non-blocking**: a fixed bottom bar, not a modal. The page
stays scrollable and clickable while it is up, and it doesn't grab focus. So
don't give it `aria-modal` or a focus trap — that would tell a screen reader
the page behind is inert when it isn't.

To look at the consent bar while developing:

```sh
PUBLIC_CONSENT_PREVIEW=true npm run dev
```

That renders the bar on its own — GA4 and GTM stay off in `dev` either way,
so nothing is reported. Plain `npm run dev` shows no bar.

A decision is remembered, so the bar is gone on the next load. To bring it back,
reload with:

```
http://localhost:4321/yingsc/?consent=reset
```

That clears the stored choice before the bar script runs. It only exists under
`PUBLIC_CONSENT_PREVIEW=true` — the script is not emitted at all in a production
build. A private window works just as well and needs no flag.

Equivalents, if you prefer: `localStorage.removeItem('analytics_consent')` in the
console, or DevTools → Application → Local Storage → delete the row. Note storage
is per-origin, so clear it on the port you are actually looking at.

**If the flag seems to do nothing, or the bar still will not show**, it is almost
always one of three things, none of them the code:

1. A dev server was already running, so your env var was ignored — see
   [the daemon notes above](#astro-dev-is-a-background-daemon).
2. A choice is still in `localStorage` for that origin.
3. **An ad blocker is hiding it.** The id is `privacy-choice` precisely because
   `###cookie-banner` is a generic rule in Fanboy's Cookiemonster list — shipped
   in uBlock Origin, AdGuard, Brave Shields and Safari blockers — which hides
   that id on every site. Don't rename it back to anything cookie-flavoured.

Check which one with `document.getElementById('privacy-choice')` in the console:
`null` means the script removed it (a stored choice); an element that is present
but invisible means something is hiding it (a blocker).

`npm run build && npm run preview` shows the real thing, tags included.

Things in that component that are easy to break:

- **Every gtag call must push a real `arguments` object.** An arrow function
  pushing an array — `dataLayer.push(['consent', 'update', {...}])` — is treated
  as a data push, not a command, and silently does nothing. Use
  `function gtag(){ dataLayer.push(arguments); }`.
- **The stored choice is read before `gtag('consent', 'default', ...)`** and
  applied as the default, so returning visitors initialise correctly instead of
  being denied and then corrected. The banner only sends an `update` when
  someone actually clicks.
- **Don't move the tags into a Partytown worker.** That is where they used to
  live, and consent updates could not cross the boundary — accepting did nothing
  until the next page load. Partytown's `forward: ["dataLayer.push"]` also broke
  GTM's data layer. The package is still in `package.json`, but the integration
  is gone from `astro.config.mjs`.

Measured behaviour, so you know what to expect in GA4: denied is **not** silence.
Before consent, GA4 sends a cookieless ping (`gcs=G100`). Accepting applies to
the live page — the next event carries `gcs=G101` — but GA4 does **not** re-send
the initial `page_view`, so that first pageview stays cookieless.

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
