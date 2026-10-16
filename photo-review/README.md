# Feed photo selection review

Isolated review site: https://southern-crescent-photo-review.haja-jah.workers.dev/

This page shows seven proposed placement comparisons, three existing images to keep, and all 21 photos supplied in Feed.zip with individual recommendations. Source files are optimized to WebP for viewing; no production image has been replaced. Gallery numbers and original filenames are recorded in photo-index.json.

The supplied images have not been independently verified as owned work or Southern Crescent client events. The visible FEEDWELL branding and the 324px charcuterie source are explicitly flagged. Current people, hero, and coffee imagery are retained in the recommendation.

Run `python3 scripts/deploy-photo-review.py` from the repository root with the existing Cloudflare environment variables. The script deploys only the `southern-crescent-photo-review` Worker. No production Worker, custom domain, inquiry endpoint, or sitemap is updated. Review responses and HTML use noindex directives; the page has no analytics.

Validation: all displayed image resources loaded, gallery filters returned the expected 9 recommended / 7 alternative / 5 backup items, and the layout passed overflow checks at 320, 390, 768, 1024, and 1440 pixels. Chromium recorded no JavaScript errors or axe WCAG A/AA violations. The deployed page was byte-verified, its noindex header checked, and the production homepage verified unchanged.
