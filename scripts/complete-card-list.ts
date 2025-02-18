import { COLORS } from "app/lib/onepiece"
import { Effect } from "effect"
import { existsSync } from "fs"
import fs from "fs/promises"
import uniqWith from "lodash/uniqWith"
import path from "path"
import { SeedCardData } from "./scrape-optcg"

const program = Effect.gen(function* () {
  const tmpDir = path.join(process.cwd(), "tmp")
  if (!existsSync(tmpDir)) {
    throw new Error("tmp directory does not exist. Did you create the card list files?")
  }

  const allCards: SeedCardData[] = []
  for (const color of COLORS) {
    const colorCards = yield* Effect.promise(() =>
      getCardsFromFile(`${tmpDir}/${color}_cardlist.json`),
    )
    console.log(`Found ${colorCards.length} ${color} cards`)
    allCards.push(...colorCards)
  }

  const uniqCards = uniqWith(allCards, (a, b) => {
    return a.infoCol[0] === b.infoCol[0] && a.image === b.image
  }).map(({ infoCol, ...card }) => ({
    ...card,
    code: infoCol[0],
    rarity: infoCol[1],
    type: infoCol[2],
  }))
  console.log(`Unique (${uniqCards.length}) / Total (${allCards.length})`)
  yield* Effect.promise(() =>
    fs.writeFile(`${tmpDir}/Complete_cardlist.json`, JSON.stringify(uniqCards, null, 2), "utf-8"),
  )
  console.log("✅ Created Complete_cardlist.json")
})

Effect.runPromiseExit(program).then(console.log)

async function getCardsFromFile(filePath: string) {
  const file = await fs.readFile(filePath, "utf-8")
  const cards: SeedCardData[] = JSON.parse(file)

  return cards
}
