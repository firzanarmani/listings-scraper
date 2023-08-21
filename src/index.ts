import dotenv from "dotenv";
import { inject } from "./injector";
import parse from "./parser";
import scrape from "./scraper";
import { Cities, ListingsProvider } from "./constants";

dotenv.config();

const run = async (
  provider: ListingsProvider,
  cityCode: Cities,
  partner: { uid: string; email: string }
) => {
  try {
    // Scraper - Scrape a website to create data string
    const listings = await scrape(provider, cityCode);
    // Parser - Convert JSON data into properly formatted data object
    const data = await parse(provider, cityCode, listings, partner);
    // Injector - Push the data object into database
    await inject(data, provider);
  } catch (err) {
    console.log(err);
  }
};

// Should be a valid city_code
run("Filmplace", "KOR/daejeon", {
  uid: "or1ZZ77kyPWQ9eBeYEnY2dJPS4A2",
  email: "alex@gostaytion.com",
});
