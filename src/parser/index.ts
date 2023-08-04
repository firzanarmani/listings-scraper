import { ListingsProvider } from "../types/constants";
import { StaytionObject } from "../types/staytion";
import { parseCoworkerData } from "../sites/coworker/parser";

const parse = async (
  provider: ListingsProvider,
  cityCode: string,
  listings: Record<string, any[]>,
  partner: { uid: string; email: string }
) => {
  let parsedStaytionObj: StaytionObject = [];

  switch (provider) {
    case "coworker":
      parsedStaytionObj = await parseCoworkerData(cityCode, listings, partner);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  return parsedStaytionObj;
};

export default parse;
