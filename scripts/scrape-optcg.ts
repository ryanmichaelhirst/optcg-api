import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"
import { chromium } from "playwright"

const COLORS = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"]

// pnpm tsx scripts/scrape-optcg.ts
const main = async () => {
  const browser = await chromium.launch({ headless: false }) // Set headless: false to see the browser actions
  const page = await browser.newPage()

  // Navigate to the website
  await page.goto("https://en.onepiece-cardgame.com/cardlist", { waitUntil: "networkidle" })

  // Check for the cookie consent button and click if it exists
  const cookieCloseButtonSelector = "button.onetrust-close-btn-handler"
  try {
    const cookieButton = await page.waitForSelector(cookieCloseButtonSelector, {
      timeout: 10000,
      state: "visible",
    })
    if (cookieButton) {
      await cookieButton.click()
      console.log("Cookie consent banner closed.")
    }
  } catch (error) {
    console.log("Cookie consent banner did not appear.")
  }

  // Click the button inside the seriesCol div
  await page.waitForSelector('div.seriesCol button.selModalButton[data-selmodalbtn="series"]')
  await page.click('div.seriesCol button.selModalButton[data-selmodalbtn="series"]')
  console.log("Clicked the series selection button.")

  // Wait for the modal dialog to appear
  await page.waitForSelector("div.selModal", { timeout: 10000 })
  // Ensure the list with the ALL option is visible
  await page.waitForSelector(
    'div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")',
    { timeout: 10000 },
  )
  // Click the ALL option
  await page.click('div.selModalList ul li.selModalClose[data-value=""]:has-text("ALL")')
  console.log("Selected ALL in dropdown.")

  // Wait and click the "Red" color filter
  await page.waitForSelector('label.checkBtn.isColor_Red[for="color_Red"]')
  await page.click('label.checkBtn.isColor_Red[for="color_Red"]')
  console.log("Applied Red color filter.")

  // Wait to ensure the filter applies and cards load
  await page.waitForTimeout(3000)

  // Click the SEARCH button and wait for the results to load
  await page.waitForSelector("div.commonBtn.submitBtn", { timeout: 10000 })
  await page.click("div.commonBtn.submitBtn"),
    console.log("SEARCH button clicked, waiting for results.")

  const cardDataList: CardData[] = []

  let hasNextPage = true

  while (hasNextPage) {
    // Wait for the resultCol container to be visible
    await page.waitForSelector("div.resultCol", { timeout: 10000 })
    console.log('Waiting for "resultCol" to be visible.')

    // Ensure at least one card element is attached to the DOM
    await page.waitForFunction(
      () => {
        return document.querySelectorAll("div.resultCol dl.modalCol").length > 0
      },
      { timeout: 10000 },
    )

    // Get all hidden dl.modalCol elements inside resultCol
    const cardElements = await page.$$("div.resultCol dl.modalCol")
    console.log("Got card elements", cardElements.length)

    for (const cardElement of cardElements) {
      try {
        const cardHtml = await cardElement.innerHTML()
        const cardData = extractCardDataFromHtml(cardHtml)
        cardDataList.push(cardData)
      } catch (error) {
        console.error("Error extracting card data:", error)
      }
    }

    // Check if the NEXT button is disabled
    const nextButtonDisabled = await page.$("a.nextBtn.disable")
    if (nextButtonDisabled) {
      hasNextPage = false
      console.log("No more pages to scrape.")
    } else {
      // Ensure the NEXT button is visible before clicking
      const nextButton = await page.waitForSelector("div.pagerCol a.nextBtn", { timeout: 10000 })
      if (nextButton) {
        console.log("Navigating to the next page...")
        await nextButton.click()
      } else {
        console.log("NEXT button not found, stopping pagination.")
        hasNextPage = false
      }
    }
  }

  // Define the tmp directory at the project root using process.cwd()
  const tmpDir = path.join(process.cwd(), "tmp")
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }

  const filePath = path.join(tmpDir, "cardDataList.json")
  fs.writeFileSync(filePath, JSON.stringify(cardDataList, null, 2), "utf-8")
  console.log(`Card data saved to ${filePath}`)

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
}

function extractCardDataFromHtml(html: string): CardData {
  const $ = cheerio.load(html) // Load the HTML string with Cheerio

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
