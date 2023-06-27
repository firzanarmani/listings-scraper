import { Space } from "../types/coworker";
import {
  groupDuplicates,
  // groupRest,
  groupSplitCommas,
  groupSplitHyphen,
  removeSameLinks,
} from "../utils/group";

const extractBrands = (spaces: Space[]) => {
  let allSpaces = spaces;

  allSpaces = allSpaces.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });

  const listings: Record<string, Space[]> = {};

  allSpaces = removeSameLinks(allSpaces);

  allSpaces = groupDuplicates(allSpaces, listings);

  allSpaces = groupSplitCommas(allSpaces, listings);

  allSpaces = groupSplitHyphen(allSpaces, listings);

  console.log(Object.values(listings).flat().length);
  // console.log(allSpaces.length);
  // allSpaces = groupRest(allSpaces, listings)

  return listings;
};

export default extractBrands;
