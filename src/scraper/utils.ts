import {
  type Browser,
  type Page,
  type ElementHandle,
  type NodeFor,
  HTTPResponse,
} from "puppeteer";
import { ListingsProvider } from "../types/constants";
import { CITIES, Cities } from "../constants";

export const openPage = async (
  browser: Browser,
  url: string,
  returnsResponse?: string
): Promise<{ page: Page; response: HTTPResponse | null }> => {
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

  const fetchPromises: Promise<HTTPResponse | null>[] = [];

  if (returnsResponse) {
    fetchPromises.push(
      page.waitForResponse((response) =>
        response.url().startsWith(returnsResponse)
      )
    );
  }

  fetchPromises.push(page.goto(url, { waitUntil: "load" }));

  const [response] = await Promise.all(fetchPromises);

  return { page, response };
};

export const fetchJson = async (
  browser: Browser,
  url: string,
  returnsResponse?: string
): Promise<any> => {
  const { page, response } = await openPage(browser, url, returnsResponse);

  const result = await response?.json();

  await page.close();

  return result;
};

export const createLink = (
  provider: ListingsProvider,
  cityCode: Cities,
  pageIndex: number = 0,
  perPage: number = 50, // ! 100 may cause a payload thats too big
  radius: number = 100
): string => {
  // const { city } = parseCityCode(cityCode);

  switch (provider) {
    case "coworker":
      return `https://www.coworker.com/ajax/nearbyspaces?lat=${CITIES[cityCode].latitude}&lon=${CITIES[cityCode].longitude}&rad=${radius}&per_page=${perPage}&page=${pageIndex}`;
    case "allospaces":
      return "https://app.allospaces.com";
    case "filmplace":
      return `https://www.filmplace.co/en/search/room?location=${CITIES[cityCode].city},${CITIES[cityCode].country}&page=${pageIndex}`;
    default:
      // TODO Handle default case and integration with scrape()
      return "";
  }
};

export const getItem = async <Selector extends string>(
  page: Page,
  selector: Selector
): Promise<ElementHandle<NodeFor<Selector>> | null> => {
  const item = await page
    .waitForSelector<Selector>(selector, {
      visible: true,
      timeout: 1000,
    })
    .catch(() => null);

  return item;
};

export const clickOnItem = async <Selector extends string>(
  page: Page,
  selector: Selector
): Promise<void> => {
  const item = await getItem(page, selector);

  await item?.click();
};

export const typeInItem = async <Selector extends string>(
  page: Page,
  selector: Selector,
  input: string
): Promise<void> => {
  const item = await getItem(page, selector);

  await item?.type(input, { delay: 100 });
  await item?.press("Enter");
};
