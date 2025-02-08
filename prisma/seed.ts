import { db } from "@/lib/db.server"
import { fakerEN_US as faker } from "@faker-js/faker"

import fs from "fs"
import path from "path"

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
      const jsonData = JSON.parse(content)
      for (const card of jsonData) {
        // cardName: 'Sanji',
        // life: 'Cost4',
        // attribute: 'Strike',
        // power: '5000',
        // counter: '1000',
        // color: 'Yellow',
        // type: 'The Vinsmoke Family',
        // effect: '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
        // cardSet: '-KINGDOMS OF INTRIGUE- [OP04]',
        // infoCol: [ 'OP04-104', 'SR', 'CHARACTER' ],
        // colorFilter: 'Yellow'
        await db.card.create({
          data: {
            name: card.cardName,
            cost: Number(card.life || card.cost),
            attribute: card.attribute,
            power: Number(card.power),
            counter: Number(card.counter),
            color: card.color,
            type: card.type,
            effect: card.effect,
            set: card.cardSet,
            serialNumber: card.infoCol[0],
            rarity: card.infoCol[1],
            category: card.infoCol[2],
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
