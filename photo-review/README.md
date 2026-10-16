# Feed photo selection review

Isolated review site: https://southern-crescent-photo-review.haja-jah.workers.dev/

This page shows ten proposed placement comparisons, three existing images to keep, and all 33 photos supplied in Feed.zip and Box Photos.zip with individual recommendations. Source files are optimized to WebP for viewing; no production image has been replaced. Original Feed numbers and filenames are recorded in photo-index.json. New box photos use B01–B12 and are recorded in box-photo-index.json. The new collection is linked directly at /#box-photos.

The supplied images have not been independently verified as owned work or Southern Crescent client events. The visible FEEDWELL branding and the 324px charcuterie source are explicitly flagged. Current people, hero, and coffee imagery are retained in the recommendation.

Run `python3 scripts/deploy-photo-review.py` from the repository root with the existing Cloudflare environment variables. The script deploys only the `southern-crescent-photo-review` Worker. No production Worker, custom domain, inquiry endpoint, or sitemap is updated. Review responses and HTML use noindex directives; the page has no analytics.

Validation: all displayed image resources loaded, gallery filters returned the expected 9 recommended / 7 alternative / 5 backup items, and the layout passed overflow checks at 320, 390, 768, 1024, and 1440 pixels. Chromium recorded no JavaScript errors or axe WCAG A/AA violations. The deployed page was byte-verified, its noindex header checked, and the production homepage verified unchanged.

Box collection validation: all 33 gallery images and ten comparison groups loaded, the original Feed filters continued to affect only the original 21 photos, and all 12 box photos remained visible. Five viewport widths passed overflow checks; Chromium recorded no JavaScript errors or axe violations. Menu labels and the production website were not changed.

## Latest alternate crops

The Bacon, Egg & Cheese English Muffin ZIP adds three alternate square versions: C01 danishes, C02 English muffins, and C03 crab-and-prawn sliders. The muffin photo is an exact byte duplicate of B03 and is not repeated. The review now contains 36 unique image files across three collections and 13 placement/crop comparisons. The separately displayed sandwich image is not present in the ZIP; its exact file remains pending.

Validation for this update: every displayed image loaded, all 13 comparisons and original gallery filters passed, five widths had no horizontal overflow, and Chromium reported zero JavaScript errors and zero axe violations.
