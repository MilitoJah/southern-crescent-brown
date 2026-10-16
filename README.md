# Southern Crescent Hospitality

A static website built with HTML, CSS, and JavaScript. Python 3 and Node are available in the cloud environment; no application dependencies or build step are required.

## Development

Use the existing checkout. Cloud tasks are already isolated; do not create a worktree unless requested. Run `npm run dev` from this directory to serve port 3000. Run `node --check app.js` for JavaScript syntax. Main pages are listed in `scripts/main-pages.json`; archived concept/photo comparisons stay separate and have noindex metadata.

## Design and photography

`brand-fonts.css` loads self-hosted font files. `style.css` retains the exploration layouts; `finish.css` standardizes the main customer-facing pages. Supplied logo files are unchanged SVG vector artwork. Photographs are optimized WebP files; a restrained CSS treatment brings their saturation/contrast closer together without fabricating detail. Small source images are not artificially enlarged. Source records are in `PHOTO-CREDITS.md`.

## Inquiry form

`contact.html` validates the inquiry in the browser, then posts it to `/api/inquiry`. The Worker (`scripts/worker-template.js`) checks the fields, drops submissions that fill the hidden `website` field, formats times as 12 hour AM/PM and numeric budgets with a dollar sign, and submits the answers to the Microsoft Form "Southern Crescent Hospitality — Event Inquiry". The Power Automate flow "Southern Crescent Event Inquiry Alerts" then emails hello@southerncrescenthospitality.com and sends the client a thank you. If sending fails, the page falls back to the email draft (open in email app, copy, or download).

The initial inquiry has seven required essentials, with phone, budget, timing, and special requests optional. Billing address and referral source are not collected. The adapter provides explicit non-answers for legacy required Microsoft questions so the existing question IDs and automation can remain in place. See `BUYER-CONTENT-REVIEW.md` for the mapping and outstanding menu, policy, and evidence approvals.

The Worker maps site fields to Microsoft Forms question IDs in `QUESTION_IDS`. If a question in the Microsoft Form is deleted and recreated, update its ID there and in the flow's email body.

## QA

`scripts/qa-finish.cjs` tests all main pages, 320/390/768/1024/1440-pixel layouts, local assets and links, keyboard navigation, mobile menus, field validation, inquiry contents, downloads, and stale-draft handling. The current run used Playwright Chromium, Firefox, and WebKit plus axe-core 4.10.3. Browser engines and axe-core were installed in temporary paths; see `QA-REPORT.md` for the recorded results and limits.

## Deploy

Pushing to `main` deploys automatically through `.github/workflows/deploy.yml`, which runs `python3 scripts/deploy-preview.py` with the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. You can also run the workflow manually from the Actions tab. It updates only the southern-crescent-brown Worker. Static files use a Cloudflare-supported binary data module, preserving each asset byte-for-byte. It does not touch the existing green or olive Workers.

## Published website

https://southerncrescenthospitality.com/

Pushing to `main` saves the source and triggers the deploy workflow.

## Google Analytics

Google Analytics 4 uses measurement ID `G-N8VB1X2NBM` on the 12 main website pages. Archived concepts and owner setup pages are excluded. The asynchronous Google tag records standard page activity; no custom inquiry-submission conversion is configured. Google signals and advertising personalization signals are disabled in the site configuration. Keep enhanced-measurement Form interactions disabled in the Analytics web stream; no received-inquiry conversion event is currently configured. Verify receipt in Analytics Realtime after opening the public website; a loaded tag alone does not prove data appeared in the property.

## Menu and ordering content

Owner-supplied sample selections are published on `catering-menus.html`; native details panels open for direct category links. `catering-details.html` centralizes approved ordering, setup, dietary, payment, and cancellation information. Delivery pricing and the short-lead final-headcount deadline remain pending clarification; see `BUYER-CONTENT-REVIEW.md`. The evidence/photo step remains pending source identification and approval.
