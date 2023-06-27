import { ListingsProvider } from "../types/constants";
import { StaytionObject } from "../types/staytion";
// import writeJSONToFile from "../utils/writeFile";
import { parseCoworkerData } from "./coworker";

const parse = async (
  provider: ListingsProvider,
  cityCode: string,
  rawListings: any[]
) => {
  let parsedStaytionObj: StaytionObject = {
    brands: [],
    outlets: [],
    listings: [],
    rates: [],
  };

  switch (provider) {
    case "coworker":
      parsedStaytionObj = await parseCoworkerData(cityCode, rawListings);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  // writeJSONToFile(JSON.stringify(parsedStaytionObj, null, 2), "parsed");

  return parsedStaytionObj;
};

export default parse;
