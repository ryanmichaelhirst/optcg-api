import "@dotenvx/dotenvx/config"
import * as cheerio from "cheerio"
import { Config, Effect, Redacted } from "effect"
import fs from "fs"
import path from "path"
import { chromium } from "playwright"

const COLORS = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"]

const program = Effect.gen(function* () {
  const redactedPw = yield* Config.redacted("PROXY_PASSWORD")
  const browser = yield* Effect.promise(() =>
    chromium.launch({
      headless: true,
      proxy: {
        // Use rotating proxy to avoid IP ban
        server: `http://residential-proxy.scrapeops.io:8181`,
        username: "scrapeops",
        password: Redacted.value(redactedPw),
      },
    }),
  )
  const context = yield* Effect.promise(() => browser.newContext({ ignoreHTTPSErrors: true }))
  const page = yield* Effect.promise(() => context.newPage())

  // https://scrapeops.io/docs/residential-mobile-proxy-aggregator/integration-examples/nodejs-playwright-example/
  // Test rotating IP to make sure it's working
  // await page.goto("https://httpbin.org/ip")
  // const pageContent = await page.textContent("body")
  // console.log(pageContent)
  // return

  yield* Effect.promise(() =>
    page.goto("https://en.onepiece-cardgame.com/cardlist", {
      timeout: 180000,
    }),
  )

  // Handle cookie consent
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

  // Click the series selection button
  yield* Effect.promise(() =>
    page.waitForSelector('div.seriesCol button.selModalButton[data-selmodalbtn="series"]'),
  )
  yield* Effect.promise(() =>
    page.click('div.seriesCol button.selModalButton[data-selmodalbtn="series"]'),
  )
  console.log("Clicked the series selection button.")

  // Select "ALL" in the series dropdown
  yield* Effect.promise(() => page.waitForSelector("div.selModal"))
  yield* Effect.promise(() =>
    page.waitForSelector('div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")'),
  )
  yield* Effect.promise(() =>
    page.click('div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")'),
  )
  console.log("Selected ALL in dropdown.")

  for (const color of COLORS) {
    let hasNextPage = true
    let pageNum = 0
    const colorCardData: CardData[] = []
    console.log(`Starting to scrape cards for color: ${color}`)

    // Apply the color filter
    const colorSelector = `label.checkBtn.isColor_${color}[for="color_${color}"]`
    yield* Effect.promise(() => page.waitForSelector(colorSelector))
    yield* Effect.promise(() => page.click(colorSelector))
    console.log(`Applied ${color} color filter.`)

    // Click the SEARCH button and wait for results
    yield* Effect.promise(() => page.waitForSelector("div.commonBtn.submitBtn"))
    yield* Effect.promise(() => page.click("div.commonBtn.submitBtn"))
    console.log(`SEARCH button clicked for color: ${color}, waiting for results.`)

    while (hasNextPage) {
      console.log(`Scraping page ${pageNum + 1} for color ${color}`)
      Effect.promise(() => page.waitForSelector("div.resultCol"))

      // Ensure at least one card element is attached to the DOM
      yield* Effect.promise(() =>
        page.waitForFunction(() => {
          return document.querySelectorAll("div.resultCol dl.modalCol").length > 0
        }),
      )

      // Get all hidden dl.modalCol elements inside resultCol
      const cardElements = yield* Effect.promise(() => page.$$("div.resultCol dl.modalCol"))
      console.log(`Found ${cardElements.length} cards for color: ${color}`)

      for (const cardElement of cardElements) {
        try {
          const cardHtml = yield* Effect.promise(() => cardElement.innerHTML())
          const cardData = extractCardDataFromHtml(cardHtml)
          cardData.colorFilter = color // Add color filter info
          colorCardData.push(cardData)
        } catch (error) {
          console.error(`Error extracting card data for color ${color}:`, error)
        }
      }

      // Check if NEXT button is disabled
      const nextButtonDisabled = yield* Effect.promise(() =>
        page.$("div.pagerCol a.nextBtn.disable"),
      )
      if (nextButtonDisabled) {
        hasNextPage = false
        console.log(`Finished scraping all pages for color: ${color}`)
      } else {
        const nextButton = yield* Effect.promise(() =>
          page.waitForSelector("div.pagerCol a.nextBtn", {
            state: "visible",
          }),
        )

        if (nextButton) {
          pageNum++
          yield* Effect.promise(() => nextButton.scrollIntoViewIfNeeded())
          yield* Effect.promise(() => nextButton.click())
          // console.log(`Navigating to next page for color: ${color}`)
        } else {
          console.log(`NEXT button not found for color: ${color}, stopping pagination.`)
          hasNextPage = false
        }
      }
    }

    // Deselect the color before moving to the next
    yield* Effect.promise(() => page.click(colorSelector))
    console.log(`Finished scraping ${pageNum} pages for color ${color}`)

    // Save all card data
    const tmpDir = path.join(process.cwd(), "tmp")
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    const filePath = path.join(tmpDir, `${color}_cardlist.json`)
    fs.writeFileSync(filePath, JSON.stringify(colorCardData, null, 2), "utf-8")
    console.log(`Color card data saved to ${filePath}`)
  }

  yield* Effect.promise(() => browser.close())
})

interface CardData {
  cardName: string
  cost: string
  attribute: string
  power: string
  counter: string
  color: string
  type: string
  effect: string
  cardSet: string
  infoCol: string[]
  colorFilter?: string // To store the applied color filter
}

function extractCardDataFromHtml(html: string): CardData {
  const $ = cheerio.load(html)

  const getText = (selector: string): string => {
    return $(selector).text().trim() || ""
  }

  return {
    cardName: getText(".cardName"),
    cost: getText(".cost").replace("Life", "").replace("Cost", "").trim(),
    attribute: getText(".attribute i"),
    power: getText(".power").replace("Power", "").trim(),
    counter: getText(".counter").replace("Counter", "").trim(),
    color: getText(".color").replace("Color", "").trim(),
    type: getText(".feature").replace("Type", "").trim(),
    effect: getText(".text").replace("Effect", "").trim(),
    cardSet: getText(".getInfo").replace("Card Set(s)", "").trim(),
    infoCol: $(".infoCol span")
      .map((_, span) => $(span).text().trim())
      .get(),
  }
}

Effect.runPromise(program)
