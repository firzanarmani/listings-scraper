import {
  type Browser,
  type Page,
  type ElementHandle,
  type NodeFor,
} from "puppeteer";
import { ListingsProvider } from "../types/constants";
import { CITIES } from "../constants";

const openPage = async (browser: Browser, url: string): Promise<Page> => {
  const page = await browser.newPage();

  // Block images (to cut down loading time)
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "image") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url, { waitUntil: "load" });

  return page;
};

const createLink = (
  provider: ListingsProvider,
  cityCode: string,
  pageIndex: number = 0,
  perPage: number = 100,
  radius: number = 100
): string => {
  switch (provider) {
    case "coworker":
      return `https://www.coworker.com/ajax/nearbyspaces?lat=${CITIES[cityCode].latitude}&lon=${CITIES[cityCode].longitude}&rad=${radius}&per_page=${perPage}&page=${pageIndex}`;
    case "allospaces":
      return "https://app.allospaces.com";
    default:
      // TODO Handle default case and integration with scrape()
      return "";
  }
};

// TODO Can I somehow use ReturnType?
const getItem = async <Selector extends string>(
  page: Page,
  selector: Selector
): Promise<ElementHandle<NodeFor<Selector>> | null> => {
  const item = await page
    .waitForSelector<Selector>(selector, {
      visible: true,
      timeout: 1000,
    })
    .catch((err) => null);

  return item;
};

const clickOnItem = async <Selector extends string>(
  page: Page,
  selector: Selector
): Promise<void> => {
  const item = await getItem(page, selector);

  await item?.click();
};

const typeInItem = async <Selector extends string>(
  page: Page,
  selector: Selector,
  input: string
): Promise<void> => {
  const item = await getItem(page, selector);

  await item?.type(input, { delay: 100 });
  await item?.press("Enter");
};

export { openPage, createLink, getItem, clickOnItem, typeInItem };
