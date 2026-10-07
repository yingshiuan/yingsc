---
title: 'MenuDash'
subtitle: 'A restaurant menu for WordPress, kept in a spreadsheet'
featured: true
type: 'Professional'
created: 2026-10-07
domains:
  - Product Engineering
  - Full-Stack Engineering
stack:
  - PHP
  - WordPress
  - JavaScript
  - Python
category: 'WordPress Plugin'
tags: ['Product Engineering', 'WordPress', 'Business Model', 'Open Source', 'Validation']
image: './cover.webp'
hoverImage: './cover-hover.webp'
thumbnail: './thumbnail.webp'
info: 'One menu online that every guest filters by language and diet, instead of a separate menu for each, then split into a free core and paid add-ons.'
description: 'I turned a restaurant''s three hand-copied menus into one spreadsheet and a WordPress plugin that every guest filters by language and diet, designed the upload so a wrong file can''t break the live page, and then made it a product: a free, open-source core for every café and four paid add-ons for a full restaurant.'
role: 'Product Engineer & Founder'
timeline: '2 weeks to stable, live on the client''s site from week 1'
completed: 'Stable 2.7.0 · Live on afatt.ch since 09/2026'
credit: 'A Fatt'
creditLink: 'https://afatt.ch/menu/'
tools: ['PHP', 'WordPress', 'Block Editor', 'JavaScript', 'CSS', 'Python', 'WordPress Playground', 'Puppeteer', 'Claude Code']
focus:
  [
    'Product Engineering',
    'Data Modelling',
    'Business Model',
    'Validation',
  ]
activities: 'A restaurant client kept an English, a German and a separate vegan and vegetarian menu, in layouts I had designed, copied by hand between them. Rather than risk the three drifting apart, I turned the menu into data: one spreadsheet, a column per language and a mark per diet, read by a WordPress plugin I designed so every guest filters the one menu on their phone. I designed the owner''s side around the file going wrong, with a report that refuses a broken upload and keeps the live menu online. Then I made it a product: a free open-source core and four paid add-ons, split along the line between a café and a full restaurant, with an architecture where each add-on works on its own and a business that sells the setup and the care. I built it with Claude Code: I designed the product and the data model, wrote the specifications, reviewed every change and decided what shipped.'
---

<div class="contentSection">

## Overview

A Fatt kept three menus: an English one, a German one, and a separate vegan and vegetarian one. I designed those layouts. Every dish was copied by hand between them, so one price change meant three edits, and every copy was a chance for the three menus to stop saying the same thing.

Making another printed version would only add to that risk. So I proposed something else: why not put the menu online, on the website they already had? Collect every dish once, in one Excel sheet, with a column per language and a mark per diet. Instead of the restaurant printing a menu for each kind of guest, each guest filters the one menu on their own phone.

MenuDash is the WordPress plugin I designed and built to do that. It runs the [menu page on afatt.ch](https://afatt.ch/menu/): 110 dishes in three languages, filtered by diet, rebuilt whenever the owner uploads the sheet. Then, because the problem wasn't specific to one restaurant, I made it a product. The core and its theme are open source: [MenuDash on GitHub](https://github.com/yingshiuan/menudash) · [MenuDash Theme](https://github.com/yingshiuan/menudash-theme).

#### Key Highlights

- **I turned a layout problem into a data problem.** Three menus that could disagree became one sheet that can't disagree with itself, and every version a guest wants is a filter on it.
- **I designed for two users.** The guest wants their language and their diet in one tap. The owner wants to change a price without calling me.
- **I designed the failure path first.** A wrong file gets a red report and is refused, and the live menu stays online.
- **I split the product where the customers split.** A free core for every café, paid add-ons for a full restaurant, and code where each add-on works on its own.

![The sample menu on a desktop: all three languages at once, the diet filters, the category tabs. Placeholder photos.](./menu-desktop.webp)

</div>

<div class="contentSection">

## One Sheet, Two Users

The whole product hangs on one decision: the spreadsheet is the source, and everything the guest sees is a view of it. That made the sheet both the owner's interface and the code's data model, so I designed it for both.

**For the owner, it had to be the sheet they'd write anyway.** A dish is a row; a category is a row with a name and no price. Columns are found by their title, in English or German, so the order doesn't matter and extra columns are ignored. It reads the file the way Swiss Excel writes it, with semicolons, and takes a whole Excel workbook in one upload, each sheet going where it belongs. A missing translation falls back to another language instead of leaving a gap.

**For the guest, the filters had to mean what a guest means.** Vegetarian includes vegan, because a vegetarian can eat it. Spicy and Not spicy switch each other off, because both at once would show nothing. Categories with nothing left are hidden. The guest reads all three languages at once or one at a time, and on a phone a Chinese name that doesn't fit beside the German one moves to its own line.

A filter button only appears when at least one dish has that mark, so a guest never taps Gluten-free and gets an empty menu. The owner decides which buttons the guest sees, and can swap in their own icons. Switching a button off hides only the button; the marks beside the dishes stay, because they're still true.

![The diet icons on the owner's side, on the sample menu: each mark with its icon, a filter button that can be switched off, and how many dishes have it.](./menudash-diet-icons.webp)

**And for both of them, it had to be a real web page.** The menu is HTML in all three languages, not a PDF or a picture, so it works without JavaScript and search engines read every dish.

![The owner's side: the MenuDash page in the WordPress dashboard after an upload, on the sample menu.](./dashboard-upload.webp)

</div>

<div class="contentSection">

## Designing the Failure Path

Once the menu lives in one sheet, that sheet has to be right, because nobody re-checks a layout anymore. And the person uploading it isn't the person who designed the data. So I designed the upload around getting it wrong:

- **Every upload gets a report.** Green: fine. Yellow: the menu went live, but something looks odd. Red: the file wasn't used, and the old menu stays online.
- **It checks for the mistakes a restaurant actually makes:** a file in the wrong encoding, which would lose the Chinese; the wrong file entirely; two dishes sharing a number; the same dish listed twice with different diet marks.
- **Nothing is final.** The last five uploads are one click away, and the live menu downloads as a file to change and upload again.

![The report after uploading A Fatt's own Excel workbook, on the local test site: the menu sheet becomes the menu (18 categories, 110 dishes), the specials sheet goes to today's specials, and the drinks sheet is reported as not used.](./menudash-excel-upload.webp)

The twin check proved itself on their real menu. Duck Pancakes appeared in two categories, vegetarian in one and unmarked in the other. A guest filtering for vegetarian, the very guest the separate menu had been for, would have found only one of them. The menu was corrected.

</div>

<div class="contentSection">

## From a Client Job to a Product

Once the menu worked, the rest of what guests check on a restaurant's site turned out to be the same problem: opening hours, a holiday closure, today's specials, gift cards. Each is something the owner changes in one place and forgets in the others. I built them on the same dashboard page, and by version 1.11 one plugin did all of it.

Then I had to decide how to sell it. My first plan was one package at a lower price. But a small café only needs the menu, and a full restaurant wants all of it, so one price fits neither. At 2.0 I split it along the same line as the customers:

| | What it does | Who needs it |
|---|---|---|
| **MenuDash** (free) | The menu, photos, diet filters, QR table cards, the meat and fish origin list Swiss law requires | Every restaurant and café |
| **Restaurant** | Details entered once, opening hours, an "open now" badge, a holiday notice that takes itself down | A restaurant with a real website |
| **Specials** | Today's specials and the lunch menu of the week | A kitchen that changes its offer |
| **Gift Cards** | Gift card orders by e-mail, nothing paid online | A restaurant that sells gift cards |
| **Statistics** | Which dishes guests look at, without cookies | An owner who wants to know what works |

![Opening hours in the Restaurant add-on, with the joined days on the right as guests will see them.](./menudash-opening-hours.webp)

![Today's specials from A Fatt's own spreadsheet, in the Specials add-on on the local test site.](./menudash-specials.webp)

**Why the core is free.** The code is GPL, like WordPress, so anyone who buys a zip may pass it on. Rather than fight that with licence keys, I asked what an owner actually pays for. Most never install a plugin themselves; they pay for someone to set it up, put their menu into the sheet, and answer when something changes. So the business sells the setup and the care: a one-time setup, and a yearly fee for the add-ons' updates and help. The free core is the shop window on GitHub, and it means a restaurant's menu never depends on me.

**Why there's no shop yet.** Checkout, licence keys and automatic updates only pay off once restaurants I don't know come looking. I planned how they would work and left them unbuilt; until then, every customer is one I set up myself.

</div>

<div class="contentSection">

## Architecture That Follows the Business

A pricing split only works if the code splits cleanly too. A café on the free core can't see broken pieces of features it didn't buy, and a restaurant that adds Gift Cards next year can't have to reinstall anything.

- **Each add-on is its own plugin** that waits for the core and plugs in through hooks. Without it, its parts show nothing, so a page built for all of them still works with the core alone.
- **The add-ons don't need each other.** Gift Cards uses the phone and address from Restaurant when it's installed, and its own fields when it isn't.
- **A browser test runs the core alone and each add-on without the others,** so every package works, including ones nobody has bought yet.
- **One export writes two repositories,** the public core and the private add-ons, and refuses to write the public copy if the client's name, address or photos turn up in it, or if add-on code has leaked into the core.

The theme follows the same rule. It stores no address, phone or hours of its own; it reads them from MenuDash on every page view, and fills in more as add-ons are installed. A restaurant can start with the menu and grow into a full site without a rebuild.

![The menu page in the public MenuDash Theme, with sample data: the lunch menu and today's specials above the menu, and one language switch for all of it.](./menudash-theme-menu.webp)

</div>

<div class="contentSection">

## How I Built It

I built MenuDash with Claude Code. I designed the product and the data model, wrote the specifications, reviewed every change and decided what shipped. The parser is tested against A Fatt's real spreadsheet as well as made-up ones, and the whole thing runs locally in WordPress Playground, so a site with the client's menu starts with one command.

**I didn't wait for it to be finished.** After one week, at version 1.3, I installed it on afatt.ch to test it against the real site and the real menu, and kept updating it there as each new version shipped. A week later it reached a stable version, 2.7. Testing on the client's site while building is how the real menu's problems showed up early instead of after launch.

**The last step before a release is a security review.** A plugin that takes files from a restaurant owner and a form from any visitor is an open door if nobody checks it, and code that works isn't the same as code that's safe. So before a version ships, I run a review of how it could be abused, and what turns up is fixed before it goes out. Those reviews are where most of the hardening came from:

- **A diet icon can't carry a script.** Uploaded SVGs are cleaned down to plain shapes, and a review found one more way in, a file written in a different text encoding, which is now refused too.
- **A huge photo can't crash the server.** Images over 40 megapixels are refused before they're opened.
- **An Excel file is read as if it were hostile.** A workbook is a zip of XML files, so it is a classic way to attack a server. MenuDash reads only the sheet parts, each with a size cap; refuses XML entities and any path outside the workbook; stops at 3,000 rows by 60 columns; never runs a formula, using the saved values instead; refuses macro workbooks; and never stores the workbook itself, only the CSV made from it.
- **Stored menu files can't be guessed from the web,** because a menu file can hold columns the public page never shows.
- **The gift card form holds up against spam** without needing a login: a hidden field, a signed minimum time, a link filter, and limits per visitor and per day.

</div>

<div class="contentSection">

## Where It Stands

The core has run A Fatt's menu page since the end of September 2026, now at the stable version 2.7. It is early: the owner's real test, updating the menu month after month without me, is still ahead. The four add-ons and the theme are built, offered through insdash, and not on A Fatt's site yet. A Fatt is the first restaurant running it; the split is built for the ones that come next.

</div>

<div class="contentSection">

## What I Took From It

- **Turn a layout problem into a data problem.** Three menus that could disagree became one sheet, and every version became a filter.
- **Design the failure path before the happy path.** The refusal is the feature; the report is how the owner learns the format without a manual.
- **Split the product where the customers split.** A café and a restaurant need different amounts of the same tool.
- **The architecture is part of the business model.** Add-ons that work on their own are what make à la carte pricing possible.

</div>
