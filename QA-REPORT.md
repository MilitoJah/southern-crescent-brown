# Website finishing and QA report

The main customer-facing website has been refined and deployed. Archived concept/photo boards remain available separately and carry noindex metadata.

## Scope

- 11 main pages: index, corporate-catering, meeting-catering, drop-off-catering, charcuterie-grazing, bar-and-beverage, event-planning, hospitality-professionals, catering-menus, careers, contact.
- Shared header, footer, spacing, accessible focus styles, responsive photo crops, and a restrained photographic color treatment.
- Self-hosted fonts and local images. Logos remain unchanged copies of supplied artwork.
- Dedicated grazing and event-planning pages; menu, delivery, meeting, corporate, staffing, and beverage content now answer different planning questions.
- Consistent inquiry links and service preselection.

## Validation evidence

- 33 page/browser combinations: Chromium, Firefox, and WebKit across every main page.
- Reflow checks at 320, 390, 768, 1024, and 1440 CSS pixels: no horizontal overflow.
- Main-page image loading and internal link/anchor checks: passed.
- Keyboard skip link, service dropdown, Escape, mobile navigation, and focus behavior: passed.
- Automated accessibility: axe-core 4.10.3, WCAG 2 A/AA and WCAG 2.1 AA tags plus best-practice checks. Zero reported violations on the 11 page states and two additional contact form states.
- Inquiry: 12 required fields, readable errors and focus, email/date/guest-count constraints, service preselection, all entered details preserved in draft, email-draft encoding, copy handler/fallback, text download, and stale-draft reset: passed.
- 22 live pages/assets matched the locally tested files byte-for-byte. Styled missing-page response returned HTTP 404.
- JavaScript syntax and Python deployment-script compilation: passed.

## Inquiry behavior

The form creates a draft locally. Visitors review it, then choose Open email app, Copy inquiry, or Download draft. They must send from their own email client. No direct inbox integration or server-side form storage is configured. Tests did not send email. The clipboard handler and fallback were exercised without modifying the operating-system clipboard.

## Practical limits and remaining launch decisions

- WebKit is an engine-level compatibility check, not testing on a physical iPhone or macOS Safari. Physical-device, operating-system email-client, and assistive-technology tests remain unrun.
- Automated accessibility and keyboard checks do not establish complete WCAG conformance; no screen-reader certification is claimed.
- Source photographs vary in original resolution and lighting. Presentation is more consistent, but no missing detail was invented or upscaled. Higher-resolution originals remain preferable for any visibly soft image.
- Current dishes, prices, order minimums, delivery fees, service terms, and actual job openings still need business approval. None were invented.
- All stock/user-supplied photography must be covered by the owner’s source licenses. No photo is labeled as an actual Southern Crescent client or past event.
- Domain migration and publication to the business’s production domain were not performed. The existing preview Worker was updated.

## Reproducing QA

The QA script is scripts/qa-finish.cjs. It uses Playwright and axe-core installed in temporary paths. Chromium is /usr/bin/chromium. Firefox/WebKit were installed under /tmp/southern-browsers. Verified Debian runtime dependencies were extracted under /tmp and supplied to WebKit’s bundled sys/lib search directories. Runtime data and screenshots are under /workspace/site-review. These temporary tools need reinstallation if not retained by the environment snapshot.

## Primary-domain SEO update

Re-ran the 11-page suite across Chromium, Firefox, and WebKit: 33 page/browser combinations, zero recorded errors and zero axe violations. Ran `node scripts/qa-seo.cjs`: unique metadata, primary canonicals, structured-data JSON, single main headings, canonical redirect behavior, marketing query preservation, missing-page noindex/status, HEAD, and unsupported-method handling passed.

Verified all 11 deployed HTML pages match local source on https://southerncrescenthospitality.com/, plus robots.txt and the 11-URL XML sitemap. Live preview-domain and /index.html redirects return 308 to the primary domain, and a nonexistent route returns 404. A Googlebot user-agent request receives indexable corporate-catering HTML; actual Google crawling/indexing remains unconfirmed. www still redirects to the previous l.ink destination pending replacement of its conflicting DNS record. See SEO-AND-TRAFFIC.md for account setup and measurement limits.
