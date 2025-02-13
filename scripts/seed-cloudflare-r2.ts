import { Effect } from "effect"
import { existsSync } from "fs"
import fs from "fs/promises"
import path from "path"
import { Readable } from "stream"
import yargs from "yargs"
import { SeedCardData } from "./scrape-optcg"

async function downloadFile(url: string, destination: string) {
  // TODO: add proxy here
  const response = await fetch(url)
  if (!response.body) throw new Error("Response body is null")

  // const imgDir = path.join(process.cwd(), "tmp/images")
  // const destination = path.resolve(imgDir, fileName)
  const stream = Readable.fromWeb(response.body)

  await fs.writeFile(destination, stream)
}

const program = Effect.gen(function* () {
  // Parse args
  const argv = yargs(process.argv.slice(2))
    .options({
      color: { type: "string", default: "red" },
      mode: { type: "string", default: "prod" },
    })
    .parseSync()
  // red -> Red
  const color = argv.color.charAt(0).toUpperCase() + argv.color.slice(1)
  const mode = argv.mode

  // Load card list
  const imgDir = path.join(process.cwd(), "tmp/images")
  if (!existsSync(imgDir)) {
    yield* Effect.promise(() => fs.mkdir(imgDir, { recursive: true }))
  }
  const tmpDir = path.join(process.cwd(), "tmp")
  const cardListFile = yield* Effect.promise(() =>
    fs.readFile(`${tmpDir}/${color}_cardlist.json`, "utf-8"),
  )
  const cardsJson: SeedCardData[] = JSON.parse(cardListFile)

  // Download card images
  for (const card of cardsJson) {
    const fileName = path.join(imgDir, card.infoCol[0] + ".png")

    yield* Effect.promise(() => downloadFile(card.image, fileName))
    console.log(`Downloaded ${fileName}`)
  }
})

Effect.runPromiseExit(program).then(console.log)
