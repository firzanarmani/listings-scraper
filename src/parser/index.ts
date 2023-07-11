import { ListingsProvider } from "../types/constants";
import { StaytionObject } from "../types/staytion";
import { parseCoworkerData } from "../sites/coworker/parser";

const parse = async (
  provider: ListingsProvider,
  cityCode: string,
  listings: Record<string, any[]>
) => {
  let parsedStaytionObj: StaytionObject = {
    brands: [],
    outlets: [],
    listings: [],
    rates: [],
  };

  switch (provider) {
    case "coworker":
      parsedStaytionObj = await parseCoworkerData(cityCode, listings);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  return parsedStaytionObj;
};

export default parse;
