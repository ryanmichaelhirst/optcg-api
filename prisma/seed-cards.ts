import { db } from "@/lib/db.server"
import fs from "fs"
import path from "path"
import { SeedCardData } from "scripts/scrape-optcg"

export async function seedCards() {
  const files = fs.readdirSync(path.join(process.cwd(), "tmp"))
  if (files.length === 0) {
    throw new Error("No card data files found in /tmp. Did you run the scraper?")
  }

  for (const file of files) {
    const filePath = path.join(process.cwd(), "tmp", file)

    const content = fs.readFileSync(filePath, "utf-8")
    const jsonData: SeedCardData[] = JSON.parse(content)
    console.log(`seeding ${jsonData.length} cards for ${filePath}`)

    for (const card of jsonData) {
      await db.card.create({
        data: {
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
        },
      })
    }
  }
}
