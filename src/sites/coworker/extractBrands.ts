import { CompleteSpace } from "./types";
import {
  groupDuplicates,
  groupSplitCommas,
  groupSplitHyphen,
  removeSameLinks,
} from "../../utils/group";

const extractBrands = (spaces: CompleteSpace[]) => {
  let allSpaces = spaces;

  allSpaces = allSpaces.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });

  const listings: Record<string, CompleteSpace[]> = {};

  allSpaces = removeSameLinks(allSpaces);

  allSpaces = groupDuplicates(allSpaces, listings);

  allSpaces = groupSplitCommas(allSpaces, listings);

  allSpaces = groupSplitHyphen(allSpaces, listings);

  // Naively add everything else
  allSpaces.forEach((space) => {
    listings[space.name] = [space];
  });

  return listings;
};

export default extractBrands;
