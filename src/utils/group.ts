import { Space } from "../types/coworker";
import Trie from "./RadixTrie";

const groupBy = <T>(arr: T[], fn: (item: T) => any) =>
  arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

// Group extraction 1 - Obvious exact duplicates
export const groupDuplicates = (
  spaces: Space[],
  listings: Record<string, Space[]>
) => {
  let allSpaces = spaces;
  const groupedSpaces = groupBy(allSpaces, (item) => item.name);
  // eslint-disable-next-line no-restricted-syntax
  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      // eslint-disable-next-line no-param-reassign
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }
  return allSpaces;
};

// Group extraction 2 - Split with ", " as in "Spaces - Bangkok, Spaces Chamchuri Square"
export const groupSplitCommas = (
  spaces: Space[],
  listings: Record<string, Space[]>
) => {
  let allSpaces = spaces;
  const filteredSpaces = allSpaces.filter((space) => {
    const words = space.name.split(", ", 2);
    return (
      words.length > 1 && !words[1].trimStart().toLowerCase().startsWith("ltd")
    );
  });

  const groupedSpaces = groupBy(
    filteredSpaces,
    (item) => item.name.split(", ", 2)[0]
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      // eslint-disable-next-line no-param-reassign
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }

  return allSpaces;
};

// Group extraction 3 - Split with " - " as in "Spaces - Bangkok, Spaces Chamchuri Square"
export const groupSplitHyphen = (
  spaces: Space[],
  listings: Record<string, Space[]>
) => {
  let allSpaces = spaces;
  const filteredSpaces = allSpaces.filter((space) => {
    const words = space.name.split(" - ", 2);
    return (
      words.length > 1 && !words[1].trimStart().toLowerCase().startsWith("ltd")
    );
  });

  const groupedSpaces = groupBy(
    filteredSpaces,
    (item) => item.name.split(" - ", 2)[0]
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      // eslint-disable-next-line no-param-reassign
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }

  return allSpaces;
};

// export const groupRest = (
//   spaces: Space[],
//   listings: Record<string, Space[]>
// ) => {
//   let allSpaces = spaces.filter(
//     (space) =>
//       space.name.toLowerCase().startsWith("s") ||
//       space.name.toLowerCase().startsWith("t") ||
//       space.name.toLowerCase().startsWith("w")
//   );

//   // console.log(allSpaces.map(item => item.name))
//   const brands = new Trie();
//   // allSpaces.forEach((space) => brands.addSpace(space));
//   brands.addSpaces(allSpaces);
//   brands.print();

//   return allSpaces;
// };

const getMaxItem = <T>(arr: T[], fn: (item: T) => any) =>
  arr.reduce((prev, curr) => (fn(prev) > fn(curr) ? prev : curr));

export const removeSameLinks = (spaces: Space[]) => {
  let allSpaces = spaces;
  const groupedSpaces = groupBy(allSpaces, (item) => item.space_url);
  // eslint-disable-next-line no-restricted-syntax
  for (const [_groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      const latestSpace = getMaxItem(groupSpaces, (space) => space.id);
      allSpaces = allSpaces.filter((space) => space.id !== latestSpace.id);
    }
  }

  // eslint-disable-next-line no-param-reassign
  return allSpaces;
};
