import { CompleteSpace } from "../types/coworker";
import {
  groupDuplicates,
  // groupRest,
  groupSplitCommas,
  groupSplitHyphen,
  removeSameLinks,
} from "../utils/group";
// import { JsonifyToFile } from "../utils/writeFile";

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

  // allSpaces = allSpaces.filter((word) =>
  //   word.name.toLowerCase().startsWith("t")
  // );
  // JsonifyToFile(
  //   allSpaces.map((item) => item.name),
  //   "rest"
  // );
  // groupRest(allSpaces, listings);
  // console.log(Object.values(listings).flat().length);
  // JsonifyToFile(listings, "test");

  // Naively add everything else
  allSpaces.forEach((space) => {
    listings[space.name] = [space];
  });

  console.log(Object.values(listings).length);

  return listings;
};

export default extractBrands;
