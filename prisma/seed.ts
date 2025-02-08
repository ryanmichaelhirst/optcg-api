import { db } from "@/lib/db.server"
import { fakerEN_US as faker } from "@faker-js/faker"

import fs from "fs"
import path from "path"
import { SeedCardData } from "scripts/scrape-optcg"

async function seed() {
  const iterations = Array.from(Array(10).keys())
  for (const iter of iterations) {
    await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        googleId: faker.string.numeric(10),
      },
    })
  }

  try {
    const files = fs.readdirSync(path.join(process.cwd(), "tmp"))
    if (files.length === 0) {
      throw new Error("No card data files found in /tmp. Did you run the scraper?")
    }

    for (const file of files) {
      const filePath = path.join(process.cwd(), "tmp", file)

      const content = fs.readFileSync(filePath, "utf-8")
      const jsonData: SeedCardData[] = JSON.parse(content)
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
  } catch (err) {
    console.error(err)
  }
}

seed()
  .then(async () => {
    console.log("🚀 Seed completed successfully")
  })
  .catch((e) => {
    console.error(e)
    console.log("❌ Seed failed")
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
