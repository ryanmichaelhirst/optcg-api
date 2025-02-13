# OPTCG-API

Bare bones api for viewing cards in one piece tcg.

## Web Scraper

Run the playwright script with `pnpm tsx scripts/scrape-optcg.ts`.
Setup env vars beforehand. Note that this script only runs for one color at a time to avoid memory issues.

By default script runs with `pnpm tsx scripts/scrape-optcg.ts --color=red --mode=prod`
Pass a specific color with `pnpm tsx scripts/scrape-optcg.ts --color=blue`
Color options: red | green | blue | purple | black | yellow

Pass a specific script mode with `pnpm tsx scripts/scrape-optcg.ts --color=blue --mode=test`
Mode options: test | dev | prod

## Seeding

Run docker container
`pnpm docker`

Seed database
`pnpm prisma migrate reset`

View db
`pnpm prisma studio`

Need to reset and re-seed the Card table?
`pnpm tsx scripts/cards-seed`

## Caching images

Setup Cloudflare R2: https://developers.cloudflare.com/r2/get-started/

Run the cloudflare script with `pnpm tsx scripts/cf-r2-seed`

Same rules apply from Web Scraper section.
