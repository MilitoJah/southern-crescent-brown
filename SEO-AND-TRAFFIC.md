# Search visibility and qualified inquiries

Primary website: https://southerncrescenthospitality.com/
Priority buyers: office managers, executive assistants, administrative and HR teams, and corporate meeting planners in metro Atlanta. Government agencies and crews remain secondary audiences.

## Implemented

- Unique service-and-location page titles and descriptions across 11 main pages.
- Primary-domain canonical and social URLs, XML sitemap, crawlable HTML, and an open robots.txt.
- Organization, website, page, service, and breadcrumb structured data using known business details. No invented address, reviews, ratings, pricing, or credentials.
- Relevant office-planning content and inquiry links on corporate and meeting pages.
- Permanent redirects from the brown Workers address and, when connected, www to the primary domain. /index.html and supported extensionless page URLs also redirect to their canonical URLs. Marketing query parameters survive redirects.
- Real missing-page status with noindex, preserved noindex on archived concepts, and corrected SVG favicon MIME type.

These changes help discovery and interpretation; they do not establish Google indexing or promise rankings. No Search Console, analytics, ad campaign, Business Profile, or external directory listing has been created.

## Account steps

1. Google Search Console: https://search.google.com/search-console/
   Add a Domain property for southerncrescenthospitality.com. Google supplies a DNS TXT verification record; publish that exact record in Cloudflare DNS, then Verify. If DNS integration is offered, review the requested scope. Do not replace Microsoft 365 or other existing TXT records.
   Submit https://southerncrescenthospitality.com/sitemap.xml. Inspect the homepage, corporate catering, and meeting catering URLs and request indexing after verification. Inspect live canonical selection and indexing reports over time. No sitemap-ping URL or ordinary Indexing API request is applicable here.
2. Google Business Profile: https://www.google.com/business/
   Create one profile for Southern Crescent Hospitality only if the business meets Google's eligibility rules for in-person service. A service-area caterer can hide its address when clients are not served there. Supply a real verification address privately; do not use a virtual office or invented location. Choose the closest available primary category, normally Caterer; use actual services and real operating/service hours. The website's published phone hours alone do not establish all operating hours. Google controls verification and profile approval.
3. www: remove the conflicting A/AAAA/CNAME record named www in Cloudflare DNS, then add www.southerncrescenthospitality.com as a custom domain on southern-crescent-brown. Preserve root and mail records. The current token cannot read/delete the conflicting DNS record.

## Qualified traffic priorities

- Keep name, phone, website, service area, and confirmed business hours consistent across the Business Profile, Instagram, LinkedIn, and legitimate local business directories.
- Add a descriptive website link to the Instagram bio and a complete LinkedIn company page. Use original, permission-cleared photos; request honest reviews from actual clients after service, without incentives or filtering.
- Publish practical content buyers need: office catering ordering checklist; meeting breakfast and coffee planning; choosing boxed meals versus shared platters; dietary information to collect; delivery/access questions for office buildings. State actual policies only after confirmation. Link each resource to the corresponding service and inquiry page.
- Build relationships with office managers, coworking spaces, meeting venues, and corporate planners. Any outreach must be separately authorized before sending messages.
- Before paid ads, confirm an inquiry can be received, acknowledged, and attributed. The current form prepares an email draft; Microsoft Forms + Power Automate remains unfinished. Do not count an inquiry-button click as a received lead.
- If budget is approved later, start a limited Google Search campaign aimed at Atlanta corporate/meeting catering with actual service boundaries, negative keywords such as jobs and recipes, service-specific landing pages, and budget limits. No campaign has been launched.

## Measurement

No analytics or tracking code was installed without an account/configuration decision. Use Search Console for organic impressions, relevant queries, clicks, and indexing. Once configured, measure completed submissions and actual qualified inquiries separately from clicks to email/phone. Optional tagged campaign links can use utm_source, utm_medium, and utm_campaign; do not put personal or event details in URLs.

Review weekly for the first month: indexing/canonical issues, search queries relevant to corporate catering, mobile usability, and whether genuine office inquiries arrive. Review monthly: qualified inquiry volume, lead source, proposal requests, bookings, and which pages contribute. Avoid generating thin suburb pages, buying links, fabricated reviews, or unsupported claims.

## Audit limits

Direct Google search requests returned a JavaScript/interstitial shell rather than readable results. Indexing status and rankings are unconfirmed until Search Console is verified. Local browser checks and HTTP checks do not substitute for real-user Core Web Vitals; collect field data after traffic exists.
