import { ListingsProvider } from "../types/constants";
import { StaytionObject } from "../types/staytion";
// import { JsonifyToFile } from "../utils/writeFile";
import { parseCoworkerData } from "./coworker";

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

  // writeJSONToFile(JSON.stringify(parsedStaytionObj, null, 2), "parsed");
  // JsonifyToFile(parsedStaytionObj, "test1");

  return parsedStaytionObj;
};

export default parse;
