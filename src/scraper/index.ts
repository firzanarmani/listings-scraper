import { Browser, launch } from "puppeteer";
import { createLink } from "./utils";
import { ListingsProvider } from "../types/constants";
import { AVOID_BRAND_NAMES } from "../constants";
import extractBrands from "../parser/extractBrands";
import { parseCityCode } from "../parser/utils";
import { CompleteSpace, Space } from "../types/coworker";
import chunkArray from "../utils/chunk";
import { scrapeCoworkerListing } from "./coworker";

const fetch = async (browser: Browser, url: string): Promise<any> => {
  const page = await browser.newPage();
  const data = await page.goto(url, { waitUntil: "load" });

  const result = await data?.json();

  await page.close();

  return result;
};

const scrape = async (provider: ListingsProvider, cityCode: string) => {
  const listings: any[] = [];

  const browser = await launch({
    headless: "new",
  });

  /* On first run, get the pagination information */
  const initialData = await fetch(browser, createLink(provider, cityCode));

  // TODO Refactor pagination to handle different providers
  /* Prepare links to scrape using the pagination information */
  const totalNoPages = initialData.pagination.numPages;
  const links = [];
  for (
    let currPageIndex = 1;
    currPageIndex < totalNoPages;
    currPageIndex += 1
  ) {
    links.push(createLink(provider, cityCode, currPageIndex));
  }

  /* Fetch data and parse the listings' listing */
  // TODO Clean this up
  listings.push(...initialData.spaces);
  const data = await Promise.all(
    links.map(async (url) => {
      const result = await fetch(browser, url);
      return result.spaces;
    })
  );
  listings.push(...data.flat());

  const { city } = parseCityCode(cityCode);

  // Filter results
  const filteredListings = (listings as Space[])
    .filter((space) => space.location.city_name.toLowerCase() === city)
    .filter((space) => {
      for (const brand of AVOID_BRAND_NAMES) {
        if (space.name.toLowerCase().startsWith(brand.toLowerCase()))
          return false;
      }
      return true;
    });

  const newListings: CompleteSpace[] = [];

  const listingsChunks = chunkArray(filteredListings, 20);
  for (const chunk of listingsChunks) {
    const updatedChunks = await Promise.all(
      chunk.map((listing) => scrapeCoworkerListing(browser, listing))
    );

    newListings.push(...updatedChunks.flat());
  }

  await browser.close();

  const brandsWithListings = extractBrands(newListings);

  return brandsWithListings;
};

export default scrape;
