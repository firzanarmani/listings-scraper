import parse from "./parser";
import scrape from "./scraper";
import { ListingsProvider } from "./types/constants";

const run = async (provider: ListingsProvider, cityCode: string) => {
  try {
    // Scraper - Scrape a website to create data string
    const listings = await scrape(provider, cityCode);
    // console.log(listings.length);

    // Parser - Convert JSON data into properly formatted data object
    await parse(provider, cityCode, listings);

    // Injector - Push the data object into database and test
  } catch (err) {
    console.log(err);
  }
};

// Should be a valid city_code
run("coworker", "THA/bangkok");
