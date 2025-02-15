import "@dotenvx/dotenvx/config"
import { Config, Console, Effect, Redacted } from "effect"
import { existsSync } from "fs"
import fs from "fs/promises"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
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
  console.log(`Running in ${mode} mode for ${color} cards`)

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
  const effects = []
  for (const card of cardsJson) {
    const filename = extraFilename(card.image)
    if (!filename) throw new Error(`Could not extra filename: ${card.image}`)

    const matchingFile = path.join(imgDir, filename)
    if (existsSync(matchingFile)) {
      console.log(`✅ Already downloaded ${filename}`)
      continue
    }

    effects.push(
      Effect.gen(function* () {
        console.log(`🔄 Downloading ${filename}`)
        yield* downloadFile(card.image, filename, mode).pipe(
          Effect.onInterrupt((_fibers) => Console.log("Interrupted", _fibers)),
        )
        console.log(`✅ Downloaded ${filename}`)
      }),
    )
  }
  yield* Effect.all(effects, {
    // concurrency: 10,
    concurrency: "unbounded",
  })
})

Effect.runPromiseExit(program).then(console.log)

function downloadFile(url: string, filename: string, mode: string) {
  const destination = path.join(process.cwd(), "tmp/images", filename)

  return Effect.gen(function* () {
    if (mode === "prod") {
      const redactedPw = yield* Config.redacted("PROXY_PASSWORD")
      const password = Redacted.value(redactedPw)

      // Residential Proxy Aggregator
      const proxyAgent = new HttpsProxyAgent(
        `http://scrapeops:${password}@residential-proxy.scrapeops.io:8181`,
        {
          timeout: 120000,
        },
      )
      const targetUrl = url.replace("http://", "https://")
      const response = yield* Effect.promise(() => fetch(targetUrl, { agent: proxyAgent }))
      const arrayBuffer = yield* Effect.promise(() => response.arrayBuffer())
      const buffer = Buffer.from(arrayBuffer)
      yield* Effect.promise(() => fs.writeFile(destination, buffer))

      // Proxy API Aggregator
      // const response = yield* Effect.promise(() => {
      //   const imageUrl = url.replace("http://", "https://")
      //   const proxyUrl = `https://proxy.scrapeops.io/v1/?api_key=${password}&url=${imageUrl}&residential=true`
      //   return fetch(proxyUrl)
      // })
      // if (!response.ok) throw new Error("Failed proxy request")
    } else {
      const response = yield* Effect.promise(() => fetch(url))
      if (!response.body) {
        throw new Error("Response body is null")
      }
      // @ts-expect-error ReadableStream<Uint8Array<ArrayBufferLike>> is not equivalent to ReadableStream<any>
      const stream = Readable.fromWeb(response.body)
      yield* Effect.promise(() => fs.writeFile(destination, stream))
    }
  })
}

function extraFilename(url: string) {
  const match = url.match(/card\/([^?]+)/)
  return match ? match[1] : null
}
