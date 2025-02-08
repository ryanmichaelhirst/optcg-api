# OPTCG-API

Bare bones api for viewing cards in one piece tcg.

## Web Scraper

Run the playwright script with `pnpm tsx scripts/scrape-optcg.ts`. Setup env vars beforehand.

Note that this script only runs for one color at a time to avoid memory issues.
Pass a specific color with `pnpm tsx scripts/scrape-optcg.ts --color=RED`
