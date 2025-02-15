# OPTCG-API

Bare bones api for viewing cards in one piece tcg.

## Web Scraper

Scrape card data with `pnpm tsx scripts/scrape-optcg.ts`.
Scrape card images with `pnpm tsx scripts/scrape-images.ts`.

Setup env vars beforehand. Note that these scripts only run for one color at a time to avoid long running processes.

By default script runs with `pnpm tsx scripts/scrape-optcg.ts --color=red --mode=prod`
Color: red | green | blue | purple | black | yellow
Mode: test | dev | prod

## Seeding

Run docker container
`pnpm docker`

Seed database
`pnpm prisma migrate reset`

View db
`pnpm prisma studio`

Need to reset and re-seed the Card table?
`pnpm tsx scripts/cards-seed`

<!-- ## Caching images -->

<!-- Setup Cloudflare R2: https://developers.cloudflare.com/r2/get-started/

Run the cloudflare script with `pnpm tsx scripts/cf-r2-seed`

Same rules apply from Web Scraper section. -->
