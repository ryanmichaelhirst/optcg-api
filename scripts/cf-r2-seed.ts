import "@dotenvx/dotenvx/config"
import { Config, Effect, Redacted } from "effect"
import { existsSync } from "fs"
import fs from "fs/promises"
import path from "path"
import { Readable } from "stream"
import yargs from "yargs"
import { SeedCardData } from "./scrape-optcg"

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
    const filename = extraFilename(card.image)
    if (!filename) throw new Error(`Could not extra filename: ${card.image}`)

    yield* downloadFile(card.image, filename, mode)
    console.log(`Downloaded ${filename}`)
  }
})

Effect.runPromiseExit(program).then(console.log)

function downloadFile(url: string, filename: string, mode: string) {
  return Effect.gen(function* () {
    const redactedPw = yield* Config.redacted("PROXY_PASSWORD")
    const password = Redacted.value(redactedPw)

    const response = yield* Effect.promise(() => {
      if (mode === "prod") {
        const proxyUrl = new URL("https://proxy.scrapeops.io/v1/")
        proxyUrl.searchParams.append("api_key", password)
        proxyUrl.searchParams.append("url", url)

        return fetch(proxyUrl, {
          signal: AbortSignal.timeout(120000),
        })
      }

      return fetch(url, {
        signal: AbortSignal.timeout(120000),
      })
    })
    const body = response.body
    if (!body) throw new Error("Response body is null")
    // @ts-expect-error ReadableStream<Uint8Array<ArrayBufferLike>> is not equivalent to ReadableStream<any>
    const stream = Readable.fromWeb(body)
    const destination = path.join(process.cwd(), "tmp/images", filename)
    yield* Effect.promise(() => fs.writeFile(destination, stream))
  })
}

function extraFilename(url: string) {
  const match = url.match(/card\/([^?]+)/)
  return match ? match[1] : null
}
