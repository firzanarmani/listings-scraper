import { ListingsProvider } from "../types/constants";
import { scrapeCoworker } from "../sites/coworker/scraper";
import { scrapeFilmplace } from "../sites/filmplace/scraper";
import { Cities } from "../constants";

const scrape = async (provider: ListingsProvider, cityCode: Cities) => {
  let data: Record<string, any[]> = {};

  switch (provider) {
    case "coworker":
      data = await scrapeCoworker(cityCode);
      break;
    case "filmplace":
      data = await scrapeFilmplace(cityCode);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  return data;
};

export default scrape;
