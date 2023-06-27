import { Browser, launch } from "puppeteer";
import { createLink } from "./utils";
import { ListingsProvider } from "../types/constants";

const fetch = async (browser: Browser, url: string): Promise<any> => {
  const page = await browser.newPage();
  const data = await page.goto(url, { waitUntil: "load" });

  const result = await data?.json();

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

  await browser.close();

  return listings;
};

export default scrape;
