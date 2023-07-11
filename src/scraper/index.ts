import { ListingsProvider } from "../types/constants";
import { scrapeCoworker } from "../sites/coworker/scraper";

const scrape = async (provider: ListingsProvider, cityCode: string) => {
  let data: Record<string, any[]> = {};
  switch (provider) {
    case "coworker":
      data = await scrapeCoworker(cityCode);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  return data;
};

export default scrape;
