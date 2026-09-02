---
title: 'Room Planner'
subtitle: 'Room & Class Scheduling System'
featured: true
type: 'Professional'
created: 2026-06-01
domains:
  - Product Engineering
  - Full-Stack Engineering
stack:
  - React
  - TypeScript
  - TanStack Start
  - Supabase
  - PostgreSQL
  - Cloudflare Workers
category: 'Web App'
tags: ['Full Stack', 'Product Engineering', 'Web App', 'Scheduling', 'React', 'UX', 'Accessibility']
image: './roomplan-c.png'
hoverImage: './roomplan-c.webp'
thumbnail: './roomplan.png'
info: 'A multi-tenant room and class booking system for language schools, with recurring lessons, calendar sync, and an hours report teachers invoice from.'
description: 'Scoped and priced a custom replacement for the scheduling subscription a language school had outgrown. I then built the release that turned its calendar into payroll: per-member teaching hours over any date range as an invoice-ready CSV, a calendar that works on a phone, and org-unique teacher colours across three Postgres migrations.'
role: 'Full-Stack Product Engineer'
timeline: 'June 2026 · one month from signed scope to production'
completed: 'Delivered 07/2026 · v1.3.0 08/2026 · maintained'
credit: 'Sprachschule Yang'
creditLink: 'https://sprachschule-yang.ch'
tools:
  [
    'React 19',
    'TypeScript',
    'TanStack Start',
    'TanStack Router',
    'TanStack Query',
    'Tailwind CSS',
    'Radix UI',
    'Supabase',
    'PostgreSQL',
    'Row Level Security',
    'Cloudflare Workers',
    'GitHub Actions',
  ]
focus:
  [
    'Multi-Tenant Architecture',
    'Database Security',
    'Product Engineering',
    'Data Integrity',
    'Interface Design',
    'Accessibility',
  ]
activities: 'Ran requirements with the owner, then scoped and priced a custom replacement for the commercial scheduling subscription Sprachschule Yang was paying to outgrow. Built as a pair with a senior software engineer, who owned the infrastructure, the security model and the recurring-series model, and who reviewed my work throughout. The v1.3.0 release is mine: an hours report with per-member monthly totals over any date range, exported as invoice-ready CSV; a mobile pass across the calendar and settings; a teacher palette expanded to 25 colours and kept unique per organisation across three Postgres migrations; and the in-app patch notes, written for teachers rather than developers.'
---

<div class="contentSection">

## Overview

Room Planner is a scheduling system built for [Sprachschule Yang](https://sprachschule-yang.ch), a Chinese and Japanese language school in Zürich Wiedikon. Teachers book rooms, classes repeat weekly or bi-weekly for a term, and at the end of the month somebody has to turn all of it into a number they can invoice.

The application is multi-tenant: every school is an organisation with its own rooms, members, roles and colours, isolated at the database level rather than by application code. Bookings live in one calendar that can be read as a Day grid, a Week grid or a Month overview, subscribed to from Google Calendar or Apple Calendar, and reported on per member over any date range.

It replaced a subscription whose price had doubled, and cost a fraction of a single year of it. The harder part was deciding what not to build: I mapped the school's whole term with the owner, and most of what that map showed is deliberately not in the system.

![Room Planner day view](./day.png)

#### Key Highlights

- Scoped, priced and delivered a custom replacement for a commercial subscription whose price had doubled — built for about 28% of one year at the new rate, and running since at roughly 4% of it.
- Mapped the school's whole term workflow with the owner before scoping, which surfaced the hours report nobody had asked for: per-member monthly totals over any date range, ordered so two exports line up row for row, exported as invoice-ready CSV.
- Talked the school out of the native app they asked us to build. What they wanted was to reach the schedule from a phone, so they got an installable icon and a calendar rebuilt for touch rather than a project we would have been paid for.
- Scoped a class-category dimension for the hours report and then cut it — my own feature, not theirs. The school invoices by hours, and a second dimension would have doubled the surface area of a release that was already paying for itself.
- Shipped an hours query that PostgREST silently truncated at its row cap, returning no error and showing nothing on screen. Review caught it before anyone invoiced from it: data that feeds money has to prove it is complete, not merely fail loudly when it is not.

_Built as a pair. The senior engineer owned the infrastructure, the security model and the recurring-series model, and reviewed my work throughout; the requirements, the product scope and the v1.3.0 features are mine._

#### The Problem

Sprachschule Yang teaches Chinese and Japanese out of six rooms. Six teachers, two owners administering the timetable between them, the same rooms running all day every weekday.

Their booking ran on a commercial scheduling product until its monthly price doubled, which put the decision somewhere uncomfortable. The package was built for organisations many times their size and they used a fraction of it: renewing meant paying more for capacity they would never touch, and not renewing meant no scheduling at all.

They asked us whether a custom replacement made commercial sense — and if so, to scope, price and deliver it. At six rooms and six teachers it did, on one condition: that the replacement was not a smaller version of the same product, but only the parts a school this size actually runs on.

So the first work was not the grid. I sat down with the owner and went through how the school actually runs a term: how a booking is made and changed, how rooms and teachers are assigned, how students are tracked, and what happens at the end of the month when all of it has to turn into an invoice. The brief was a list of features. The workflow was what connected them, and the two did not describe the same system.

Two things mattered more than the booking grid. Classes repeat for a whole term, so one lesson in a series inevitably moves and every copy of it has to be found and edited by hand.

The second was not in the brief at all. At the end of every month, six teachers' worth of lessons had to become six numbers somebody could invoice, and the school did that with a calculator. Nobody asked for it to change, which is exactly why it was worth looking at.

#### The Solution

One calendar with rooms as columns, colour-coded by teacher, where a repeating class is a single object the system materialises into occurrences.

```
Booking or Series
↓
Materialised occurrences
↓
Calendar (Day / Week / Month) · iCal feed
↓
Hours report
↓
Invoice-ready CSV
```

The same records that make the calendar readable during the term are the records the hours report bills from at the end of it. Nothing is entered twice.

</div>

<div class="contentSection">

## Then They Asked for an App

The school wanted a native app on top of the scheduler. **We told them not to buy one.**

What they actually wanted was to reach the schedule quickly from a phone, and that is a much smaller thing than an app. A native build would have added push notifications, offline access, and a window with no browser chrome. For eight people checking which room is free at four o'clock, none of the three was the need.

So they got an icon. We drew the mark, wired it in, and showed them how to put the schedule on their home screen — two lines of code in place of a project we would have been paid to build. What it did commit us to was a calendar that genuinely works on a small screen, which is the mobile pass further down.

The savings from leaving a subscription are only real if the people who replaced it are still willing to talk you out of spending.

</div>

<div class="contentSection">

## Reporting Hours

_Shipped in v1.3.0, August 2026._

The school never asked for this page. It came out of the conversation about how the month ends, not out of the feature list.

Every booking already carried a teacher, a start and an end, which meant the schedule was one query away from a number the office was reaching with a calculator every month. Nobody had connected the two, because the counting had never been anyone's software problem — it was just the last thing you did before invoicing. Nothing new had to be entered for the system to answer it; the schedule was already the record.

It did not ship in July even so. The first release was scoped to what could be built and delivered inside a month, and the hours count was not part of what the school was paying to replace. It came back in August, after a day spent checking the delivered system against how it was actually being used, and became the centre of v1.3.0.

##### Admin view — the whole team

Pick a range and it returns lessons and hours per member, one column per month with a total on the end. Recurring classes count once per occurrence. The order is fixed — admins first, then alphabetical — so two exports from different months line up row for row. This is the view the invoice is written from.

![Hours report — admin view](./hours-admin.png)

##### Member view — your own line

Rather than hide rows in the interface, I let the same policies that gate the calendar narrow the report: a teacher sees their own lessons and hours and nobody else's. Two levels of access to one page, separated in the database — a teacher cannot read a colleague's hours by changing what the client asks for.

![Hours report — member view](./hours-member.png)

#### The bug review caught

PostgREST answers with a bounded slice of rows and `error === null` when it does. The cap is a thousand rows, and the school was already sitting on roughly a thousand bookings — so this was not a limit the system would reach one day. A range covering the year it had been running was long enough to cross it, which meant the report was capable of quietly invoicing from a fraction of the data, with nothing on screen to say so.

My query had no limit and no order, so it crossed that cap and returned a different slice each call. Review caught it before anyone invoiced from it, and the fix is the senior engineer's: ask for an **exact count** alongside the page, compare it against what actually arrived, and treat any shortfall as truncated — the one truncation signal that does not depend on what the server cap happens to be. A truncated result exports nothing; Copy and Download are disabled for the truncated, failed and still-loading states alike.

The same review found five more ways the page could be quietly wrong, and the one I think about is the smallest: a failed fetch rendered every member at zero with Copy still live, and an all-zero payroll CSV is indistinguishable from a real quiet month.

What I took from it is a distinction I did not have before. I had built a page that fetches the rows and shows them; what payroll needed was a page that knows whether it has them. A CSV asserting that nobody taught anything is worse than no CSV, so the report shows figures only when it can prove they are complete.

</div>

<div class="contentSection">

## The Calendar

Three views over the same data, each answering a different question.

##### Day, Week and Month

Day puts rooms across the top and the hours down the side — what is happening right now, and where. Week widens the same grid to seven days, for planning a term rather than a morning. Month trades detail for reach, drawing each booking as a coloured bar so a month reads as a pattern rather than a wall of text.

<video
  src="/yingsc/media/projects/room-planner/day-week-mon.mp4"
  poster="/yingsc/media/projects/room-planner/day-week-mon.webp"
  muted
  loop
  playsinline
  controls
  preload="metadata"
  aria-label="Switching between Day, Week and Month views"></video>

##### Booking in one dialog

Purpose, room, teacher, date, time, and whether it repeats. Admins can book on behalf of any teacher; everyone else books for themselves.

![New booking dialog](./newbooking.png)


##### The date is the control

_Shipped in v1.3.0, August 2026._

The date sitting between the arrows is also the way to leave them: clicking the label opens a month picker, so jumping to a week in November costs one click rather than ten presses of the arrow. The same element answers "which day am I on" and "take me somewhere else", instead of spending a separate button on each.

<video
  src="/yingsc/media/projects/room-planner/date.mp4"
  poster="/yingsc/media/projects/room-planner/date.webp"
  muted
  loop
  playsinline
  controls
  preload="metadata"
  aria-label="Clicking the date label to open a month picker"></video>


##### Filtering by member

_Shipped in v1.3.0, August 2026._

Narrowing the calendar to one teacher meant clicking seven names off one at a time, so the members row gained a single Select all / Clear all control.

<video
  src="/yingsc/media/projects/room-planner/filter.mp4"
  poster="/yingsc/media/projects/room-planner/filter.webp"
  muted
  loop
  playsinline
  controls
  preload="metadata"
  aria-label="Clearing and restoring the member filter above the calendar"></video>

Building it turned up a smaller bug worth keeping. The control sized itself to its label, and "Select all" is one character longer than "Clear all" — so every click resized the button and nudged the whole row of chips sideways. The chip you had just aimed at moved out from under the cursor, which reads as the interface being slippery rather than as anything a teacher would think to report. A fixed width holds the row still. A divider now separates the toggle from the chips, since it acts on them rather than being one of them.

The filter still resets on a page reload, which is deliberate: an empty calendar is indistinguishable from a broken one, and a teacher who returns to a blank grid concludes the bookings are gone rather than that a filter is still on.

</div>

<div class="contentSection">

## Colour Means Teacher

_Shipped in v1.3.0, August 2026._

Every booking is drawn in its teacher's colour, which is what lets a day be read at a glance rather than parsed. That only works if the colours stay distinct, and ten of them stopped being enough well before an organisation had ten teachers: the sign-up trigger picked at random, so two colleagues could collide on their first day.

Fixing it took three migrations. The first adds fifteen colours. The second moves the palette into a single SQL function so the sign-up trigger and the invite-acceptance path cannot drift apart, and gives a new member a colour no colleague holds, falling back to random only when all 25 are taken. Colour has to be assigned twice, because the organisation is not known at sign-up — the trigger aims at the pending invite, and accepting the invite corrects the pick against the organisation actually joined.

Redefining that trigger meant redefining it against its *current* body. The copy sitting in the older migration was two definitions behind and predated the email-domain gate on sign-ups; reusing it would have quietly reopened registration to any address, inside a migration whose stated purpose was colours.

The third migration repairs what was already there: members sharing a colour are moved apart with the earliest joiner keeping theirs, and anyone still holding a colour since retired from the palette is moved onto a current one.

That one runs once, against live rows, and cannot be un-run — so it reports rather than assumes. It counts what it moved and what it left alone, and when an organisation holds more teachers than there are free colours it declines to reassign instead of pushing the duplicate somewhere else. I exercised all three against a scratch organisation, seeded and torn down by local SQL kept out of the repository, and the senior engineer reviewed them before they merged and went to production.

![Teacher colour palette](./colors.png)

#### Contrast is computed, not chosen

Label colour is computed per swatch from relative luminance so every booking chip clears WCAG AA contrast — white text scores 2.15:1 on the amber entry and would have failed silently.

</div>

<div class="contentSection">

## On a Phone

_Shipped in v1.3.0, August 2026._

The calendar technically worked on a phone in the way a door technically works when you have to climb through the window: scrolling sideways to reach a later room took the time labels with it, so a booking could be read with no way to tell whether it was at 9am or 4pm.

I pinned the hour column, collapsed Day, Week and Month into one full-width control, moved the date between the arrows that change it, and folded the member legend behind a toggle.

Several controls also only grew a border on hover, which is no use on a device where hovering does not exist. They look like buttons all the time now.

<video
  class="phone"
  poster="/yingsc/media/projects/room-planner/iphone-framed-alpha-web.webp"
  muted
  loop
  playsinline
  controls
  preload="metadata"
  aria-label="Scrolling the calendar on a phone with the hour column pinned">
  <source
    src="/yingsc/media/projects/room-planner/iphone-framed-alpha-web.mp4"
    type='video/mp4; codecs="hvc1"' />
  <source
    src="/yingsc/media/projects/room-planner/iphone-framed-alpha-web.webm"
    type="video/webm" />
</video>

</div>

<div class="contentSection">

## Settings and Access

##### Profile and organisation

Each member controls their display name and colour. Each organisation has a name, an identifier and a logo shown to everyone in it.

![Settings](./setting.png)

##### Calendar sync

A personal iCal URL that Google Calendar, Outlook or Apple Calendar can subscribe to. The token is per user and regenerable, so a link shared by mistake can be revoked without touching anyone else's.

##### Membership

Invite-based, delivered by a Supabase edge function, with sign-ups restricted to approved email domains. Roles and the "modify others' bookings" permission are managed per member.

![Member settings](./setting-member.png)

##### Removing admin now removes everything

_Shipped in v1.3.0, August 2026._

Promoting someone to admin also switched on their permission to modify others' bookings — and demoting them did not switch it back off. A former admin kept edit rights over the whole school's calendar with nothing on screen saying so. Demotion now clears the permission and says on screen that it has.

</div>

<div class="contentSection">

## The System I Built On

The three decisions in this section are the senior engineer's, made in the first release. They are here because they set the shape of everything above, and because working inside them is where most of what I learned came from.

#### Isolation belongs in the database

Every table is scoped by `org_id`, and every read and write is gated by Row Level Security policies. The client holds a publishable key and is trusted with nothing.

The alternative — filtering by organisation in application queries — puts one forgotten `.eq("org_id", …)` between a school and its neighbour's timetable. Pushing the rule into the database makes the safe behaviour the default and a leak a policy bug rather than an oversight.

One school runs on it, so the neighbour is hypothetical — which is the point. The tenancy boundary is not a multi-school product: it is a column and a policy per table, close to free to put in at the start and close to impossible to retrofit once a year of real bookings exists. The development data carries a second organisation for exactly this reason, so the policies are tested by trying to read across a boundary that has something on the other side, rather than by trusting that they would hold if one ever appeared.

The functions those policies call were later relocated out of the exposed schema so they cannot be called directly through the API surface.

#### Never trust the client with identity

Regenerating a series is the one operation that deletes and re-inserts rows in bulk, so it runs as a `security definer` database function. Written naively that is an open door: any caller could delete another school's bookings and insert rows with an arbitrary `org_id`.

The function now requires an authenticated caller, checks modify rights against the series, and — the important part — reads `org_id` and `teacher_id` **from the series row rather than from its arguments**. There is no parameter left through which a caller could forge them.

#### A series is a template, not a group of copies

Editing a recurring class used to be a choice between two bad outcomes: change one lesson and it falls out of the series, or change the series and lose every individually moved lesson.

The model that fixed it is Gmail's. A booking that has been moved keeps its own schedule and stays a member of its series. Editing the series only triggers full regeneration for **structural** changes — time, weekday, interval. Changing just the purpose leaves the moved occurrences exactly where they are.

#### Built as a pair

The seam between us was clean. Beyond the three decisions above, the senior engineer owned the infrastructure — Cloudflare Workers, Supabase, the deployment — and reviewed my work throughout.

Mine is the layer above. The scope came out of the requirements I ran with the owner, and from v1.3.0 the features are mine end to end: the hours report, the mobile pass, the colour system. What the product should *not* be we decided together — declining the native app, and leaving student data out of scope.

The value of the review was rarely a defect caught in a diff. It was being asked to defend a choice out loud: a rule I could only justify by describing the screen it protected usually belonged one layer further down, in the schema. The hours report is the sharpest case, and it did not go my way.

#### Trade-offs

##### Benefits

- Tenant isolation that holds even if the frontend is wrong.
- One source of truth for the calendar, the feed and the report.
- Structural edits and cosmetic edits cost what they should.

##### Limitations

- Recurrence is weekly and bi-weekly only; no arbitrary RRULE support.
- Occurrences are materialised rows, so very long series are bounded by a horizon rather than generated infinitely.
- Room conflicts are surfaced visually rather than blocked by a database constraint.
- The hours report answers how much a member taught, not what they taught: bookings carry a free-text purpose, not a category.
- Students are outside the model. A booking knows its room and its teacher, but not who attends it, so enrolment and student billing stay in the school's own records.
- There is no automated test suite. Correctness leans on constraints and policies, which hold whatever the client does, on exercising changes by hand against seeded data, and on review. It is the weakest part of the system and the first thing I would add — starting with the hours aggregation, which is the one place a silent wrong answer becomes an invoice.

</div>

<div class="contentSection">

## System Architecture

```
                    BROWSER
                       |
                       v
        React 19 + TanStack Router (SSR)
                       |
              TanStack Query cache
                       |
        ---------------------------------
        |                               |
        v                               v
  Supabase JS client            TanStack Start server
  (publishable key)             on Cloudflare Workers
        |                               |
        |                        auth middleware
        |                       (Bearer token check)
        |                               |
        -------------- + ----------------
                       |
                       v
               PostgreSQL (Supabase)
         Row Level Security on every table
                       |
         ---------------------------------
         |             |                 |
         v             v                 v
    bookings /    RPC functions      Edge function
    series /      security definer    invite email
    profiles      + authorization
```

#### Frontend

React 19 with TanStack Router in server-rendered mode, TanStack Query for data, Tailwind and Radix primitives for the interface. The calendar, the hours report and settings are three routes behind one authenticated boundary.

#### Backend

Supabase provides Postgres, auth and storage. The application's logic lives in the schema itself — policies, constraints and RPC functions — rather than in a separate API tier. The Workers runtime handles SSR, auth middleware and the iCal endpoint.

#### Delivery

Pushes to `main` build with Bun and deploy to Cloudflare Workers through Wrangler in GitHub Actions.

</div>

<div class="contentSection">

## Releasing to Non-Developers

The users are teachers, so the changelog is written for teachers. Each release ships an in-app patch notes page that says what changed in plain language, shows a screenshot of it, and is candid about bugs — including the release where editing a series could delete it.

![Patch notes](./patchnotes.png)

#### v1.3.0 — "Hours & Handhelds"

The release of 29 August 2026 closed both of the school's remaining manual jobs: counting the month's hours and reaching the schedule from a phone. The sections above describe the release in an engineer's terms; the patch notes describe the same work again, in the words a teacher would use.

Both versions had to be true at once. Technically, the Hours page aggregates bookings by teacher and by month across an arbitrary date range, with each lesson credited whole to the month it starts in. For a teacher, that becomes: "Ask for more than one month and every month gets a column of its own." Writing the second version is the test of whether you understood the first.


</div>

<div class="contentSection">

## Outcome

Room Planner runs in production for Sprachschule Yang at [roomplan.org](https://roomplan.org), replacing a commercial scheduling subscription priced for organisations many times its size. It holds roughly 1,000 bookings across six teachers, two admins and six rooms.

Building it cost about **28% of a single year** of the subscription at its raised price — a 72% saving before the first year was out. The gap widens after that: the system's whole running cost is a domain renewal and an hour of maintenance, around **4% of the subscription**, so the recurring bill is roughly **96% lower**.

It also replaced something nobody had asked it to. Teachers used to submit their hours and an admin reconciled each one against the bookings by hand. That was still happening after the July release — I spent a day in August going through the delivered system against how the school was actually using it, and found the recount running on software that already held every number it needed. The figures are now derived from the bookings themselves, so the admin verifies and exports rather than recounting. The brief was to cost less than the subscription, and the system ended up doing something the subscription never did, because the data needed for it was already sitting in the bookings.

#### What I took from it

##### Put invariants where they cannot be bypassed.

- Tenant isolation as RLS policies, and identity derived server-side inside privileged functions, hold regardless of what the client sends. I did not design either one; a release spent building on top of them is what taught me why they are placed where they are.

##### Silence is the expensive failure mode.

- My hours query returned no error and looked perfectly correct while it was silently truncated. Data that feeds money has to prove it is complete, not merely fail loudly when it is not.

##### Model the domain, not the screen.

- Once a series is a template with materialised occurrences rather than a bag of copies, "edit this one" and "edit all of them" stop competing for the same behaviour. Every feature I added to the calendar was cheaper because that call had been made early.

##### What they ask for is not the job.

- The hours report was never requested, and the native app was. Being close enough to a client's work to tell the two apart is worth more to them than agreeing to whichever one they said out loud.

#### Where we stopped

##### A dimension I wanted

A per-organisation class category dimension — a picker on the booking dialog and a filter on the hours report — so a school billing different rates per programme can pick a range and a category once and export the number it invoices.

I went looking for this while building the Hours page, expecting it to be a column I had not thought to display. It is not. Nothing in the system knows what a lesson is *about*: the only field describing one is a free-text purpose, which would file "B2 English", "b2 english" and "B2 Eng." as three separate courses. Counting by category means introducing the category first — a per-organisation table, a picker on the dialog every teacher uses, and a filter that the table, the totals and both exports have to agree on.

So it is scoped and not built. The school invoices by hours, and hours shipped; categories are a second dimension that would have doubled the surface area of a release that was already paying for itself. Cutting my own feature was easier to justify than the one I talked them out of, and harder to notice I needed to.

##### A system we could have sold

The same restraint decided the shape of the whole system. The workflow map described something several times larger than what we built — students, enrolment, the parts of running a school that never touch a room booking. We could have proposed that, and it would have been a longer project at a higher price, with every line of it defensible. We did not, because the school's problem was a subscription that had doubled, not an absence of software.

Not everything the map showed was refused, though, and the difference is the whole rule. The tenancy boundary went in on day one because a column and a policy cost nothing then and cannot be added afterwards without moving a year of live bookings. The management system did not, because it is a product rather than a boundary, and a product can be built the day someone needs it. Cheap and irreversible goes in early; expensive and reversible waits.

Which is what mapping the whole workflow was for. Not an inventory of everything that could be built — a way of knowing where to stop.

</div>
