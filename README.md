# Southern Crescent Hospitality

A static website built with HTML, CSS, and JavaScript. Python 3 and Node are available in the cloud environment; no application dependencies or build step are required.

## Development

Use the existing checkout. Cloud tasks are already isolated; do not create a worktree unless requested. Run `npm run dev` from this directory to serve port 3000. Run `node --check app.js` for JavaScript syntax. Main pages are listed in `scripts/main-pages.json`; archived concept/photo comparisons stay separate and have noindex metadata.

## Design and photography

`brand-fonts.css` loads self-hosted font files. `style.css` retains the exploration layouts; `finish.css` standardizes the main customer-facing pages. Supplied logo files are unchanged SVG vector artwork. Photographs are optimized WebP files; a restrained CSS treatment brings their saturation/contrast closer together without fabricating detail. Small source images are not artificially enlarged. Source records are in `PHOTO-CREDITS.md`.

## Inquiry draft

`contact.html` prepares an inquiry locally with accessible validation, service preselection, review, copy, and text-file download. It opens a mailto draft only when the visitor chooses Open email app. Visitors must send from their email client. No inbox integration, database, or automatic form submission is configured. No form fields are written to local storage or sent to the server.

## QA

`scripts/qa-finish.cjs` tests all main pages, 320/390/768/1024/1440-pixel layouts, local assets and links, keyboard navigation, mobile menus, field validation, inquiry contents, downloads, and stale-draft handling. The current run used Playwright Chromium, Firefox, and WebKit plus axe-core 4.10.3. Browser engines and axe-core were installed in temporary paths; see `QA-REPORT.md` for the recorded results and limits.

## Deploy

Run `python3 scripts/deploy-preview.py` with securely injected `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. It updates only the southern-crescent-brown Worker. Static files use a Cloudflare-supported binary data module, preserving each asset byte-for-byte. It does not touch the existing green or olive Workers.

## Published website

https://southern-crescent-brown.haja-jah.workers.dev/

The deployment script publishes to Cloudflare. Pushing to GitHub saves the source; it does not automatically trigger deployment. Microsoft Forms and Power Automate integration is pending the public form link and account configuration; see `MICROSOFT-FORMS-SETUP.md`.
