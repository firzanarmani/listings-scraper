import dotenv from "dotenv";
import { inject } from "./injector";
import parse from "./parser";
import scrape from "./scraper";
import { ListingsProvider } from "./types/constants";
dotenv.config();

const run = async (provider: ListingsProvider, cityCode: string) => {
  try {
    // Scraper - Scrape a website to create data string
    const listings = await scrape(provider, cityCode);
    // Parser - Convert JSON data into properly formatted data object
    const data = await parse(provider, cityCode, listings);
    // Injector - Push the data object into database
    await inject(data);
  } catch (err) {
    console.log(err);
  }
};

// Should be a valid city_code
run("coworker", "THA/bangkok");
