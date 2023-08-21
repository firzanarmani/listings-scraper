import { Cities, ListingsProvider } from "../constants";
import { StaytionObject } from "../types/staytion";
import { parseCoworkerData } from "../sites/coworker/parser";
import { parseFilmplaceData } from "../sites/filmplace/parser";

const parse = async (
  provider: ListingsProvider,
  cityCode: Cities,
  listings: Record<string, any[]>,
  partner: { uid: string; email: string }
) => {
  let parsedStaytionObj: StaytionObject = [];

  switch (provider) {
    case "Coworker":
      parsedStaytionObj = await parseCoworkerData(cityCode, listings, partner);
      break;
    case "Filmplace":
      parsedStaytionObj = await parseFilmplaceData(cityCode, listings, partner);
      break;
    case "Allospaces":
      break;
    default:
      break;
  }

  return parsedStaytionObj;
};

export default parse;
