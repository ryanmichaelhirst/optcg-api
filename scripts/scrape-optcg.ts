import "@dotenvx/dotenvx/config"
import * as cheerio from "cheerio"
import { Config, Effect, Redacted } from "effect"
import fs from "fs"
import path from "path"
import { chromium } from "playwright"
import yargs from "yargs"

const program = Effect.gen(function* () {
  const argv = yargs(process.argv.slice(2))
    .options({
      color: { type: "string", default: "red" },
      mode: { type: "string", default: "prod" },
    })
    .parseSync()
  // red -> Red
  const color = argv.color.charAt(0).toUpperCase() + argv.color.slice(1)
  const mode = argv.mode

  const { browser, page } = yield* setup(mode)

  console.log("Opening onepiece site")
  yield* Effect.promise(() =>
    page.goto("https://en.onepiece-cardgame.com/cardlist", {
      timeout: 180000,
    }),
  )

  const cookieCloseButtonSelector = "button.onetrust-close-btn-handler"
  try {
    const cookieButton = yield* Effect.promise(() =>
      page.waitForSelector(cookieCloseButtonSelector, {
        state: "visible",
      }),
    )
    if (cookieButton) {
      yield* Effect.promise(() => cookieButton.click())
      console.log("Cookie consent banner closed.")
    }
  } catch {
    console.log("Cookie consent banner did not appear.")
  }

  const setSelector = 'div.seriesCol button.selModalButton[data-selmodalbtn="series"]'
  yield* Effect.promise(() => page.waitForSelector(setSelector))
  yield* Effect.promise(() => page.click(setSelector))
  console.log("Clicked the card set selection button.")

  yield* Effect.promise(() => page.waitForSelector("div.selModal"))
  console.log("Card set modal appeared")
  const allOptionSelector = 'div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")'
  yield* Effect.promise(() => page.waitForSelector(allOptionSelector))
  yield* Effect.promise(() => page.click(allOptionSelector))
  console.log("Selected ALL in dropdown.")

  const colorCardData: SeedCardData[] = []
  console.log(`Starting to scrape cards for color ${color}`)

  const colorSelector = `label.checkBtn.isColor_${color}[for="color_${color}"]`
  yield* Effect.promise(() => page.waitForSelector(colorSelector))
  yield* Effect.promise(() => page.click(colorSelector))
  console.log(`Applied ${color} filter`)

  const searchBtnSelector = "div.commonBtn.submitBtn"
  yield* Effect.promise(() => page.waitForSelector(searchBtnSelector))
  yield* Effect.promise(() => page.click(searchBtnSelector))
  console.log(`SEARCH for ${color} cards`)

  // Ensure at least one card element is attached to the DOM
  yield* Effect.promise(() => page.waitForSelector("div.resultCol"))
  console.log(`Scraping cards for color ${color}`)

  // Get all hidden <dl> elements containing the card data
  // We do not need to paginate through the list, they are all preloaded in the DOM
  const cardElements = yield* Effect.promise(() => page.$$("div.resultCol dl.modalCol"))
  console.log(`Found ${cardElements.length} cards`)

  for (const cardElement of cardElements) {
    try {
      const cardHtml = yield* Effect.promise(() => cardElement.innerHTML())
      const cardData = extractCardDataFromHtml(cardHtml)
      colorCardData.push(cardData)
    } catch (error) {
      console.error(`Error extracting card data for color ${color}:`, error)
    }
  }

  console.log(`Finished scraping for color ${color}`)

  const tmpDir = path.join(process.cwd(), "tmp")
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }
  const filePath = path.join(tmpDir, `${color}_cardlist.json`)
  fs.writeFileSync(filePath, JSON.stringify(colorCardData, null, 2), "utf-8")
  console.log(`Saved file ${filePath}`)

  yield* Effect.promise(() => browser.close())
})

function setup(type: string) {
  console.log(`Running playwright in ${type} mode`)
  return Effect.gen(function* () {
    const redactedPw = yield* Config.redacted("PROXY_PASSWORD")
    const browser = yield* Effect.promise(() =>
      chromium.launch({
        headless: true,
        // Use rotating proxy to avoid IP ban
        ...(type === "prod" && {
          proxy: {
            server: `http://residential-proxy.scrapeops.io:8181`,
            username: "scrapeops",
            password: Redacted.value(redactedPw),
          },
        }),
      }),
    )
    const context = yield* Effect.promise(() => browser.newContext({ ignoreHTTPSErrors: true }))
    const page = yield* Effect.promise(() => context.newPage())

    // https://scrapeops.io/docs/residential-mobile-proxy-aggregator/integration-examples/nodejs-playwright-example/
    // Test rotating IP to make sure it's working
    if (type === "test") {
      yield* Effect.promise(() => page.goto("https://httpbin.org/ip"))
      const pageContent = yield* Effect.promise(() => page.textContent("body"))
      return yield* Effect.fail("Testing rotating IP to make sure it's working: " + pageContent)
    }
    console.log("Finished setting up playwright")

    return { browser, page }
  })
}

export interface SeedCardData {
  cardName: string
  cost: string
  attribute: string
  power: string
  counter: string
  color: string
  class: string
  effect: string
  cardSet: string
  infoCol: string[]
  image: string
}
function extractCardDataFromHtml(html: string): SeedCardData {
  const $ = cheerio.load(html)

  const getText = (selector: string): string => {
    return $(selector).text().trim() || ""
  }

  // Extract image URL, preferring data-src if available
  const getImageUrl = () => {
    const imageUrl = $("img.lazy").attr("data-src") || $("img.lazy").attr("src")
    if (!imageUrl) throw new Error("Image URL not found")
    return new URL(imageUrl.replace("../", ""), "http://en.onepiece-cardgame.com/").href
  }

  return {
    cardName: getText(".cardName"),
    cost: getText(".cost").replace("Life", "").replace("Cost", "").trim(),
    attribute: getText(".attribute i"),
    power: getText(".power").replace("Power", "").trim(),
    counter: getText(".counter").replace("Counter", "").trim(),
    color: getText(".color").replace("Color", "").trim(),
    class: getText(".feature").replace("Type", "").trim(),
    effect: getText(".text").replace("Effect", "").trim(),
    cardSet: getText(".getInfo").replace("Card Set(s)", "").trim(),
    infoCol: $(".infoCol span")
      .map((_, span) => $(span).text().trim())
      .get(),
    image: getImageUrl(),
  }
}

Effect.runPromiseExit(program).then(console.log)
