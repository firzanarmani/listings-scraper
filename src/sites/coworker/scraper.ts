import { launch } from "puppeteer";
import { CompleteSpace, Space } from "./types";
import { createLink, fetchJson } from "../../scraper/utils";
import { parseCityCode } from "../../parser/utils";
import { AVOID_BRAND_NAMES } from "../../constants";
import extractBrands from "./extractBrands";

export const scrapeCoworker = async (cityCode: string) => {
  const browser = await launch({
    headless: "new",
  });

  // On first run, get pagination information
  const initialData = await fetchJson(
    browser,
    createLink("coworker", cityCode)
  );

  // Prepare links to scrape using the pagination information
  const totalNoPages = initialData.pagination.numPages;
  const links = [];
  for (
    let currPageIndex = 1;
    currPageIndex < totalNoPages;
    currPageIndex += 1
  ) {
    links.push(createLink("coworker", cityCode, currPageIndex));
  }

  // Push the listings
  const listings: any[] = [];
  listings.push(...initialData.spaces);

  const data = await Promise.all(
    links.map(
      (url) =>
        new Promise((resolve, reject) =>
          // eslint-disable-next-line no-promise-executor-return
          fetchJson(browser, url)
            .then((result) => resolve(result.spaces))
            .catch((err) => reject(err))
        )
    )
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

  const updatedListings: CompleteSpace[] = filteredListings.map((listing) => ({
    ...listing,
    operatingHours: {
      weekday: {
        open: "09:00",
        close: "17:00",
      },
      saturday: null,
      sunday: null,
    },
    meetingRooms: [],
  }));

  await browser.close();

  const brandsWithListings = extractBrands(updatedListings);

  return brandsWithListings;
};
