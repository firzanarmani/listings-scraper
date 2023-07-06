import { Browser } from "puppeteer";
import { CompleteSpace, Space } from "../types/coworker";
import { openPage } from "./utils";
import { removeTrailingChar } from "../utils/removeTrailingChar";

const convertTimeSimple = (time: string, isAm: boolean) => {
  if (isAm) return time;

  const hours = time.split(":");

  if (!hours[0]) throw new Error("Unable to convert time string");

  if (hours[0] === "12") return time;

  return `${parseInt(hours[0], 10) + 12}:${hours[1]}`;
};

const extractHoursString = (hoursString: string | null) => {
  if (!hoursString) return null;

  const splitWords = hoursString.split(" ").slice(1);

  if (splitWords.length === 1 && splitWords[0] === "Closed") {
    // Closed
    return null;
  }

  if (splitWords[0] === "24") {
    return { open: "00:00", close: "23:59" };
  }

  if (splitWords.length !== 5) {
    throw new Error(
      "Error extracting hours from listing - Unexpected format found"
    );
  }

  const open = convertTimeSimple(splitWords[0], splitWords[1] === "am");
  const close = convertTimeSimple(splitWords[3], splitWords[4] === "am");

  return { open, close };
};

export const scrapeCoworkerListing = async (
  browser: Browser,
  listing: Space
): Promise<CompleteSpace> => {
  const page = await openPage(browser, listing.profile_url_full);

  // Get operating hours
  const operatingHours = await page.evaluate(() => {
    const hoursContainer = document.querySelectorAll<HTMLDivElement>(
      ".space-member-times"
    );

    let weekday: string | null = null;
    let saturday: string | null = null;
    let sunday: string | null = null;

    if (hoursContainer.length === 3) {
      weekday = hoursContainer.item(0).textContent;
      saturday = hoursContainer.item(1).textContent;
      sunday = hoursContainer.item(2).textContent;
    }

    return { weekday, saturday, sunday };
  });

  // Get meeting rooms
  const meetingRooms = await page.evaluate(() => {
    const result = [];

    const meetingRoomElements = document.querySelectorAll<HTMLDivElement>(
      "div#meeting-rooms div.slick-slide:not(.slick-cloned)"
    );
    for (const meetingRoom of meetingRoomElements) {
      const name =
        meetingRoom.querySelector<HTMLHeadingElement>("h5")?.innerText ||
        "Meeting Room";
      const image = meetingRoom.querySelector<HTMLImageElement>("img")?.src;
      const pax =
        meetingRoom
          .querySelector<HTMLDivElement>(".space-meetingroom-quantity")
          ?.innerText.split(" ")[0] || "";
      const price =
        meetingRoom.querySelector<HTMLDivElement>(".space-meetingroom-price")
          ?.innerText || "";

      result.push({ name, image, pax, price });
    }

    return result;
  });

  const extractedHours = {
    weekday: extractHoursString(operatingHours.weekday),
    saturday: extractHoursString(operatingHours.saturday),
    sunday: extractHoursString(operatingHours.sunday),
  };

  await page.close();

  return {
    ...listing,
    operatingHours: extractedHours,
    meetingRooms: meetingRooms.map((room) => ({
      name: room.name,
      image: room.image,
      pax: parseInt(removeTrailingChar(room.pax, "+"), 10),
      price: room.price !== "" ? parseInt(room.price, 10) : null,
    })),
  };
};
