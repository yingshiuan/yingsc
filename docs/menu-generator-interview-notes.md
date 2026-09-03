# MenuGen — interview talking points

Deliberately **not** in the case study. The page should invite these questions,
not answer them. Each entry is a thing to be ready to say, not to publish.

## Adoption — the A Fatt question

This is the question the page is built to attract. Have the answer ready and
lead with it rather than waiting to be asked.

- **What they actually do.** A price change goes through the Canva system I
  delivered in 2024. A new layout still comes back to me. Both are true and
  both are the honest answer to "did it work".
- **The human version, for conversation only.** The owner is older and would
  rather ask a person than learn a tool. Say it as a fact about a segment,
  never as a complaint about a user — the page's line is the right line out
  loud too: *asking a person is not a workaround for missing software, it is a
  preference the software has to beat.*
- **What I would do differently.** Put it in front of them in week two, not
  month four. **This is now on the page** — so in conversation do not just
  repeat it, extend it: what I would have shown in week two was a rough CSV to
  preview, which is enough to find out whether the spreadsheet is a wall.
  Be ready for "what would you even have demoed that early?" 
- **The test I have not run.** One restaurant in the segment I actually claim —
  a younger owner already running the business from a phone and a spreadsheet.
  Be ready with what would count as success: a menu updated without me, twice,
  a month apart. Do not claim the segment adopts it; I have not tried.
- **If pushed on "so it failed".** It answered its question. The idea works and
  the entry point is wrong, which is a finding rather than a failure — but do
  not oversell that. One restaurant, no revenue, no second user.

## Build vs buy

- InDesign data merge and Canva bulk create both exist and both do
  spreadsheet-into-layout. **Do not claim they cannot do it.** The argument is
  about who ends up operating the file: both hand the layout back to whoever
  runs them, so either the restaurant learns a design tool or the designer
  never leaves the loop.
- Expect "so why not just teach them Canva?" The answer is that I did, in 2024,
  and it works for small changes. That is not a contradiction of the project;
  it is the same segment finding from the other side.

## "How do you know the PDF matches the preview?"

The page's central claim, and the place a sharp interviewer will push.

- What the architecture buys: it removes the entire class of drift where a
  second template forgets a field, because there is no second template.
- What it does **not** buy: print-engine differences — page breaks,
  `printBackground`, scale, font load timing. Puppeteer's print rendering is
  not the screen's rendering.
- What I actually did: checked by eye across the 13-page fixture.
- What I would build: render the PDF pages to images in CI and diff them
  against approved snapshots. First test to write, before any unit test.

## Fonts — the deep version

- The failure: a Latin display face has no CJK glyphs. My Mac fell back to a
  system Chinese font; a slim container had none. Correct for a reason that
  only existed on my machine.
- The fix on **both** sides of the wall — the preview component's computed
  style and the PDF head, Noto Sans TC linked in `index.html`, and
  `fonts-noto-cjk` plus the WenQuanYi families in the Docker image.
- The two-pass `setContent`: head-only with an empty body at `networkidle0` to
  resolve the font requests, then the real document at `domcontentloaded` so a
  body full of base64 never waits on the network.
- Every wait has a ceiling: fonts 5s, images 3s, page 60s. Lead with the
  principle, not the numbers.
- What I would do now: self-host a subsetted font rather than depend on Google
  Fonts at render time. A render path with a third-party network dependency is
  a render path that can be slow for reasons I cannot fix.
- **9 March was about 25 commits** of Chromium paths, font loading and deploy
  config. Worth owning as what shipping to a real host actually costs.

## The queue

- One process: an array, a `processing` flag, a 5-minute TTL sweep, client
  polls `/job/:id`.
- Know *why*: Puppeteer launches a Chromium per render, so concurrency is an
  out-of-memory problem, not a latency problem. A bigger timeout fixes nothing.
- What breaks: a restart loses queued jobs; a second instance serves wrong
  answers for a job id it has never seen.
- Fix order if it needed to scale: Redis-backed queue and a shared blob store
  first, then N workers, then a warm browser pool.
- **Do not call it "prepared for future scale".** The page refuses to; do not
  undo that in person. "It is a queue in an array in one process, and that is
  the honest size of the problem" is the better sentence.

## The cropper and the camera path

- Touch is a first input, not a fallback: `MouseEvent`/`TouchEvent` coordinates
  normalised, `touchmove` bound with `{ passive: false }` and `preventDefault`
  so dragging a handle does not scroll the page.
- Client-side canvas crop: frame screen coordinates mapped back through the
  letterbox offsets into natural image coordinates, drawn out as a data URI.
- `accept="image/*"` with **no** `capture` attribute — the native sheet offers
  Take Photo *and* Photo Library. Forcing the camera would break the more
  common case. Good example of a decision that is an absence.
- **Known weakness, own it before it is found:** the output canvas is sized to
  the on-screen crop frame (240px for a dish), so crops downsample to display
  size rather than preserving resolution inside the selection. Fix is to scale
  the canvas by the natural/display ratio — one line, not yet done.
- **EXIF orientation: tested, and it holds.** iPhone photographs keep the
  correct orientation through upload, crop, preview and PDF export — checked
  end to end, not assumed. Worth having ready: it is the classic phone-photo
  trap and the camera section invites the question.

## Fix before anyone reads the repo

- ~~`stores/menu.ts` `loadFromCSV` dead code~~ — **done.** Deleted, and its two
  meaningful assertions moved onto the live PapaParse path in
  `CsvUpload.spec.ts`, including a quoted-comma case the naive parser would
  have split in half. Suite went 32 → 30 tests, all against code that runs.
  If asked, this is a good short answer to "tell me about tech debt you fixed".
- `AddIcon copy.vue` and `layouts/MenuPreview copy.vue` sit in `src/components/`
  locally. **Both are untracked, so neither is on GitHub** — clean up the
  working tree, but nobody reading the repo will see them.
- Commented-out debugging blocks left in `GeneratePdf.vue` and
  `puppeteerInfra.js`.
- Bulk photo upload drops unmatched filenames silently — no count, no message.

## Things the page deliberately omits

- The owner's age and comfort with software.
- Any claim that the segment I name would adopt it.
- Figures of any kind — there was no client for this, no fee, no revenue.
- That a week of the four months went to fonts, Chromium paths and deployment.
- The EXIF question above, which is genuinely unknown rather than withheld.
