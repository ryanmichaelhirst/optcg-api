# OPTCG-API

Bare bones api for viewing cards in one piece tcg.

## Env Setup

Proxy password is your api key from scrape-ops service.
CF and S3 vars are from cloudflare r2 service.

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

## Caching images

Setup Cloudflare R2: https://developers.cloudflare.com/r2/get-started/

Run the cloudflare script with `pnpm tsx scripts/cf-r2-seed`

Same rules apply from Web Scraper section.

## Logo Generation

Generated with the following Dalle-3 prompt:

create a logo designed in a modern, swan minimalist symmetrical style.
The logo is a black vector graphic set against a clean, white background.
The symmetry of the design adds a sense of balance and harmony, while the use
of black and white creates a stark contrast, making the logo stand out.
The modern style of the logo suggests a forward-thinking, innovative approach.
Overall, this logo effectively combines simplicity and sophistication in its design.

## AI Prompt

I want you to create a competitive one piece deck. I have attached the game rules "optcg_rules.pdf" and complete card list "Complete_cardlist.json".

https://www.dropbox.com/scl/fi/g1v709jc5xc4kmx0qr1ho/Complete_cardlist.json?rlkey=bwmir0fe8o9p01qvpnd0l1l41&st=pjyzwo8p&dl=0

https://www.dropbox.com/scl/fi/p20vn5xhklxzbljxareqp/optcg_rules.pdf?rlkey=h2qza9hxr9o5jwe182pm1aci4&st=3hndn1p3&dl=0

Below is a card list for one of the best decks. This deck uses blue leader Donquixote Doflamingo (OP01-060) to flood the board with characters fast. Analyze each card in this deck by matching each array item with the "code" attribute from "Complete_cardlist.json". You need to understand what the deck does so you can create a deck that beats it.

["OP01-060","ST03-005","ST03-005","ST03-005","ST03-005","ST03-004","ST03-004","ST03-004","OP01-077","OP01-077","OP01-077","OP01-077","OP03-044","OP06-047","OP06-047","OP06-047","EB01-023","EB01-023","EB01-023","EB01-023","OP07-040","OP07-040","OP07-040","OP07-040","OP07-045","OP07-045","OP07-045","OP07-045","OP07-046","OP07-046","OP07-046","OP07-046","ST17-002","ST17-002","ST17-002","ST17-002","ST17-003","ST17-003","ST17-004","ST17-004","ST17-004","ST17-004","ST17-005","ST17-005","ST17-005","ST17-005","OP02-068","OP06-058","OP06-058","OP07-057","OP07-057"]

The deck you create must adhere to rules listed in "optcg_rules.pdf", and beat the meta deck. Provide the card code list, main strategy, and key combos.
