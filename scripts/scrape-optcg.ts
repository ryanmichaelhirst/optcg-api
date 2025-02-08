import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"
import { chromium } from "playwright"

const COLORS = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"]

const main = async () => {
  const browser = await chromium.launch({
    headless: true,
    // proxy: {
    //   // Use rotating proxy to avoid IP ban
    //   server: `http://residential-proxy.scrapeops.io:8181`,
    //   username: "scrapeops",
    //   password: "",
    // },
  })
  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  // https://scrapeops.io/docs/residential-mobile-proxy-aggregator/integration-examples/nodejs-playwright-example/
  // Test rotating IP to make sure it's working
  // await page.goto("https://httpbin.org/ip")
  // const pageContent = await page.textContent("body")
  // console.log(pageContent)
  // return

  await page.goto("https://en.onepiece-cardgame.com/cardlist", {
    timeout: 180000,
  })

  // Handle cookie consent
  const cookieCloseButtonSelector = "button.onetrust-close-btn-handler"
  try {
    const cookieButton = await page.waitForSelector(cookieCloseButtonSelector, {
      state: "visible",
    })
    if (cookieButton) {
      await cookieButton.click()
      console.log("Cookie consent banner closed.")
    }
  } catch {
    console.log("Cookie consent banner did not appear.")
  }

  // Click the series selection button
  await page.waitForSelector('div.seriesCol button.selModalButton[data-selmodalbtn="series"]')
  await page.click('div.seriesCol button.selModalButton[data-selmodalbtn="series"]')
  console.log("Clicked the series selection button.")

  // Select "ALL" in the series dropdown
  await page.waitForSelector("div.selModal")
  await page.waitForSelector('div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")')
  await page.click('div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")')
  console.log("Selected ALL in dropdown.")

  for (const color of COLORS) {
    let hasNextPage = true
    let pageNum = 0
    const colorCardData: CardData[] = []
    console.log(`Starting to scrape cards for color: ${color}`)

    // Apply the color filter
    const colorSelector = `label.checkBtn.isColor_${color}[for="color_${color}"]`
    await page.waitForSelector(colorSelector)
    await page.click(colorSelector)
    console.log(`Applied ${color} color filter.`)

    // Click the SEARCH button and wait for results
    await page.waitForSelector("div.commonBtn.submitBtn")
    await page.click("div.commonBtn.submitBtn")
    console.log(`SEARCH button clicked for color: ${color}, waiting for results.`)

    while (hasNextPage) {
      console.log(`Scraping page ${pageNum + 1} for color ${color}`)
      await page.waitForSelector("div.resultCol")

      // Ensure at least one card element is attached to the DOM
      await page.waitForFunction(() => {
        return document.querySelectorAll("div.resultCol dl.modalCol").length > 0
      })
      // Get all hidden dl.modalCol elements inside resultCol
      const cardElements = await page.$$("div.resultCol dl.modalCol")
      console.log(`Found ${cardElements.length} cards for color: ${color}`)

      for (const cardElement of cardElements) {
        try {
          const cardHtml = await cardElement.innerHTML()
          const cardData = extractCardDataFromHtml(cardHtml)
          cardData.colorFilter = color // Add color filter info
          colorCardData.push(cardData)
        } catch (error) {
          console.error(`Error extracting card data for color ${color}:`, error)
        }
      }

      // Check if NEXT button is disabled
      const nextButtonDisabled = await page.$("div.pagerCol a.nextBtn.disable")
      if (nextButtonDisabled) {
        hasNextPage = false
        console.log(`Finished scraping all pages for color: ${color}`)
      } else {
        const nextButton = await page.waitForSelector("div.pagerCol a.nextBtn", {
          state: "visible",
        })

        if (nextButton) {
          pageNum++
          await nextButton.scrollIntoViewIfNeeded()
          // console.log(`Navigating to next page for color: ${color}`)
          await nextButton.click()
        } else {
          console.log(`NEXT button not found for color: ${color}, stopping pagination.`)
          hasNextPage = false
        }
      }
    }

    // Deselect the color before moving to the next
    await page.click(colorSelector)
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

  await browser.close()
}

interface CardData {
  cardName: string
  life: string
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
    life: getText(".cost").replace("Life", "").trim(),
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

main()
