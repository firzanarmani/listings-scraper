import { ListingsProvider } from "../types/constants";
import { StaytionObject } from "../types/staytion";
import { parseCoworkerData } from "../sites/coworker/parser";
import { parseFilmplaceData } from "../sites/filmplace/parser";
import { Cities } from "../constants";

const parse = async (
  provider: ListingsProvider,
  cityCode: Cities,
  listings: Record<string, any[]>,
  partner: { uid: string; email: string }
) => {
  let parsedStaytionObj: StaytionObject = [];

  switch (provider) {
    case "coworker":
      parsedStaytionObj = await parseCoworkerData(cityCode, listings, partner);
      break;
    case "filmplace":
      parsedStaytionObj = await parseFilmplaceData(cityCode, listings, partner);
      break;
    case "allospaces":
      break;
    default:
      break;
  }

  return parsedStaytionObj;
};

export default parse;
