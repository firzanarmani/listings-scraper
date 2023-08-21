import { Cities, ListingsProvider } from "../constants";
import { scrapeCoworker } from "../sites/coworker/scraper";
import { scrapeFilmplace } from "../sites/filmplace/scraper";

const scrape = async (provider: ListingsProvider, cityCode: Cities) => {
  let data: Record<string, any[]> = {};

  switch (provider) {
    case "Coworker":
      data = await scrapeCoworker(cityCode);
      break;
    case "Filmplace":
      data = await scrapeFilmplace(cityCode);
      break;
    case "Allospaces":
      break;
    default:
      break;
  }

  return data;
};

export default scrape;
