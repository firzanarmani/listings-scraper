/* eslint-disable no-param-reassign */
import { toPascalCasePhrase } from "./toPascalCase";
import { CompleteSpace } from "../types/coworker";
import { isSimilarStrings } from "./isSimilarStrings";

export const groupBy = <T>(arr: T[], fn: (item: T) => any) =>
  arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

// Group extraction 1 - Obvious exact duplicates
export const groupDuplicates = (
  spaces: CompleteSpace[],
  listings: Record<string, CompleteSpace[]>
) => {
  let allSpaces = spaces;
  const groupedSpaces = groupBy(allSpaces, (item) => item.name);
  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }
  return allSpaces;
};

// Group extraction 2 - Split with ", " as in "Spaces - Bangkok, Spaces Chamchuri Square"
export const groupSplitCommas = (
  spaces: CompleteSpace[],
  listings: Record<string, CompleteSpace[]>
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

  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }

  return allSpaces;
};

// Group extraction 3 - Split with " - " as in "Spaces - Bangkok, Spaces Chamchuri Square"
export const groupSplitHyphen = (
  spaces: CompleteSpace[],
  listings: Record<string, CompleteSpace[]>
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
  for (const [groupName, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      listings[groupName] = groupSpaces;
      allSpaces = allSpaces.filter((space) => !groupSpaces.includes(space));
    }
  }

  return allSpaces;
};

export const groupRest = (
  spaces: CompleteSpace[],
  listings: Record<string, CompleteSpace[]>,
  currGroupName: string | null = null
) => {
  if (spaces.length === 0) {
    return;
  }

  if (currGroupName !== null && spaces[0].name.startsWith(currGroupName)) {
    const items = listings[currGroupName] || [];
    items.push(spaces[0]);
    listings[currGroupName] = items;
    groupRest(spaces.slice(1), listings, currGroupName);
    return;
  }

  if (spaces.length === 1) {
    const items = listings[spaces[0].name] || [];
    items.push(spaces[0]);
    listings[spaces[0].name] = items;
    return;
  }

  const currSpace = spaces[0];

  const currWords = currSpace.name.trim().split(" ");

  // Check if the first word is a single character or some insignificant word like 'the'
  if (currWords[0].length > 1 && currWords[0].toLowerCase().trim() !== "the") {
    const nextWords = spaces[1].name.trim().split(" ");

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Math.min(currWords.length, nextWords.length); i++) {
      console.log(`${currWords[i]} ${nextWords[i]}`);
      // if first words dont match
      if (i === 0 && !isSimilarStrings(currWords[i], nextWords[i])) {
        listings[currSpace.name] = [currSpace];
        groupRest(spaces.splice(1), listings, null);
        break;
        // if there is a common name, i > 0
      } else if (!isSimilarStrings(currWords[i], nextWords[i])) {
        const groupName = toPascalCasePhrase(currWords.slice(0, i - 1));
        const items = listings[groupName] || [];
        items.push(currSpace);

        listings[groupName] = items;
        console.log(`${groupName} - ${items}`);
        groupRest(spaces.splice(1), listings, groupName);
        break;
      }
    }
  }

  // groupRest(spaces.splice(1), listings);
  console.log(spaces.map((item) => item.name));
};

const getMaxItem = <T>(arr: T[], fn: (item: T) => any) =>
  arr.reduce((prev, curr) => (fn(prev) > fn(curr) ? prev : curr));

export const removeSameLinks = (spaces: CompleteSpace[]) => {
  let allSpaces = spaces;
  const groupedSpaces = groupBy(allSpaces, (item) => item.space_url);
  for (const [, groupSpaces] of Object.entries(groupedSpaces)) {
    if (groupSpaces.length > 1) {
      const latestSpace = getMaxItem(groupSpaces, (space) => space.id);
      allSpaces = allSpaces.filter((space) => space.id !== latestSpace.id);
    }
  }

  return allSpaces;
};
