import { db } from "@/lib/db.server"
import fs from "fs"
import differenceWith from "lodash/differenceWith"
import path from "path"
import { SeedCardData } from "scripts/scrape-optcg"

export async function seedCards() {
  const files = fs.readdirSync(path.join(process.cwd(), "tmp"))
  if (files.length === 0) {
    throw new Error("No card data files found in /tmp. Did you run the scraper?")
  }

  for (const file of files) {
    if (!file.endsWith(".json")) {
      console.log(`skipping ${file}`)
      continue
    }

    const filePath = path.join(process.cwd(), "tmp", file)
    const content = fs.readFileSync(filePath, "utf-8")
    const jsonData: SeedCardData[] = JSON.parse(content)
    console.log(`seeding ${jsonData.length} cards for ${filePath}`)

    // Only insert new cards
    const dbCards = await db.card.findMany()
    const filteredCards = differenceWith(jsonData, dbCards, (a, b) => {
      return a.image === b.image
    })
    await db.card.createMany({
      data: filteredCards.map((card) => ({
        name: card.cardName,
        cost: Number(card.cost.replace(/cost/gi, "")),
        attribute: card.attribute,
        power: Number(card.power),
        counter: Number(card.counter),
        color: card.color,
        class: card.class,
        ...(card.effect.trim().length > 1 && {
          effect: card.effect,
        }),
        set: card.cardSet,
        code: card.infoCol[0],
        rarity: card.infoCol[1],
        type: card.infoCol[2],
        image: card.image,
      })),
    })
  }
}
