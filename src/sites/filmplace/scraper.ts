import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page } from "puppeteer";
import { createLink, fetchJson, openPage } from "../../scraper/utils";
import { CompleteDatum, Datum, Filmplace } from "./types";
import chunkArray from "../../utils/chunk";
import { Cities } from "../../constants";

export const scrapeFilmplaceListing = async (page: Page) => {
  const details = await page.evaluate(() => {
    const detailObjects: {
      about: string;
      spaceInfo: string;
      amenities: string[];
      description: string;
      houseRules: string;
      prices: string;
    } = {
      about: "",
      spaceInfo: "",
      amenities: [],
      description: "",
      houseRules: "",
      prices: "",
    };

    // Get about listing
    const about = document.querySelector<HTMLParagraphElement>(
      ".about-listing p.translate"
    );

    detailObjects.about = about?.innerText?.trim() || "";

    // Get amenities
    const amenities = document.querySelector<HTMLDivElement>(
      "#allAmenitiesModal .content_modal .row"
    )?.children;

    if (amenities === undefined) {
      detailObjects.amenities = [];
    } else {
      detailObjects.amenities = []; // TODO
    }

    // Get prices and fees
    const prices = document.querySelectorAll<HTMLDivElement>(
      "div.price-info div:not([class])"
    );

    const pricesArr: string[] = [];

    for (const price of prices) {
      pricesArr.push(
        price.innerText
          .replace(/[\r\n]/gm, "") // Remove extra newlines
          .replace(": ", ":") // Fix colon spacing
          .replace(":", ": ")
          .trim()
      );
    }

    detailObjects.prices = pricesArr.join("\n");

    // Get space info
    const spaceInfo =
      document
        .querySelector<HTMLDivElement>("div.space-info")
        ?.innerText.replace("The Space", "")
        .trim() || "";

    detailObjects.spaceInfo = spaceInfo;

    // Get description
    const description =
      document
        .querySelector<HTMLDivElement>("div.description-info")
        ?.innerText.replace("Description", "")
        .trim() || "";

    detailObjects.description = description;

    // Get housing rules
    const houseRules =
      document
        .querySelector<HTMLDivElement>("div.house-rules")
        ?.innerText.replace("House Rules", "")
        .trim() || "";

    detailObjects.houseRules = houseRules;

    return detailObjects;
  });

  return details;
};

export const scrapeFilmplace = async (cityCode: Cities) => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: false,
    devtools: true,
  });

  // On first run, get pagination information
  const initialData = (await fetchJson(
    browser,
    createLink("filmplace", cityCode),
    "https://www.filmplace.co/en/room-search-results"
  )) as Filmplace;

  // Prepare links to scrape using the pagination information
  const totalNoPages = initialData.last_page;
  const links = [];
  for (
    let currPageIndex = 1;
    currPageIndex <= totalNoPages;
    currPageIndex += 1
  ) {
    links.push(createLink("filmplace", cityCode, currPageIndex));
  }

  // Scrape ALL spaces, since we might add non-pro places in the future
  const spaces: any[] = [];
  const linksChunks = chunkArray(links);
  for (const chunk of linksChunks) {
    const linksResults = await Promise.all(
      chunk.map(async (url) => {
        const result = await fetchJson(
          browser,
          url,
          "https://www.filmplace.co/en/room-search-results"
        );

        return result.data;
      })
    );
    spaces.push(...linksResults.flat());
  }

  const filteredSpaces = (spaces as Datum[]).filter((data) => data.is_pro_host);

  const results: CompleteDatum[] = [];

  for (const chunk of chunkArray(filteredSpaces)) {
    const items = await Promise.all(
      chunk.map(async (space) => {
        const { page } = await openPage(browser, space.url);

        const details = await scrapeFilmplaceListing(page);

        await page.close();

        return {
          ...space,
          description: details,
        } as CompleteDatum;
      })
    );

    results.push(...items);
  }

  await browser.close();

  const listings: Record<string, CompleteDatum[]> = {};

  listings.Filmplace = results;

  return listings;
};
