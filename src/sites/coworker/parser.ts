import {
  AMENITIES,
  CATEGORY_TAGS,
  COWORKER_AMENITIES,
  COWORKER_RESOURCES,
  CoworkerResources,
} from "../../constants";
import { CompleteSpace } from "./types";
import {
  Listing,
  OpeningHourDay,
  OpeningHours,
  Outlet,
  Rate,
  StaytionObject,
} from "../../types/staytion";
import { groupBy } from "../../utils/group";
import {
  createBrand,
  createListing,
  createOutlet,
  createRate,
  createSourceMedia,
} from "../../parser/utils";

const parseOperatingHours = (space: CompleteSpace): OpeningHours => {
  let weekday: OpeningHourDay = { sets: [], active: false };
  let saturday: OpeningHourDay = { sets: [], active: false };
  let sunday: OpeningHourDay = { sets: [], active: false };

  if (space.operatingHours.weekday) {
    weekday = {
      sets: [
        {
          open: space.operatingHours.weekday.open,
          close: space.operatingHours.weekday.close,
        },
      ],
      active: true,
    };
  }

  if (space.operatingHours.saturday) {
    saturday = {
      sets: [
        {
          open: space.operatingHours.saturday.open,
          close: space.operatingHours.saturday.close,
        },
      ],
      active: true,
    };
  }

  if (space.operatingHours.sunday) {
    sunday = {
      sets: [
        {
          open: space.operatingHours.sunday.open,
          close: space.operatingHours.sunday.close,
        },
      ],
      active: true,
    };
  }

  return {
    monday: weekday,
    tuesday: weekday,
    wednesday: weekday,
    thursday: weekday,
    friday: weekday,
    saturday,
    sunday,
  };
};

const parseAmenities = (space: CompleteSpace): string[] => {
  const outletAmenities = [];
  if (space.amenities_ids) {
    for (const amenity of space.amenities_ids.split(",")) {
      if (COWORKER_AMENITIES[amenity]) {
        outletAmenities.push(COWORKER_AMENITIES[amenity]);
      }
    }
  }

  return outletAmenities;
};

export const parseCoworkerListing = (
  space: CompleteSpace,
  listingName: string,
  capacity: number
) => {
  const categoryTags: string[] = [];
  if (listingName === COWORKER_RESOURCES.hot_desks) {
    categoryTags.push(CATEGORY_TAGS["Hot Desk"]);
  } else if (listingName === COWORKER_RESOURCES.dedicated_desks) {
    categoryTags.push(CATEGORY_TAGS.Others);
  } else if (listingName === COWORKER_RESOURCES.private_offices) {
    categoryTags.push(CATEGORY_TAGS.Meeting);
    categoryTags.push(CATEGORY_TAGS.Others);
  } else if (listingName === COWORKER_RESOURCES.meeting_rooms) {
    categoryTags.push(CATEGORY_TAGS.Meeting);
    categoryTags.push(CATEGORY_TAGS.Meeting);
  }

  return {
    name: listingName,
    description: `For ${capacity} pax`,

    amenities: [AMENITIES.WIFI, AMENITIES.AIR_CONDITIONING],
    categoryTags,

    media: [
      {
        url: space.images[0].url_no_params,
        type: "",
        public: true,
        filename: space.images[0].url_no_params.replace(/^https:\/\//, ""),
      },
    ], // ! Since there are no images for individual listings (that we can match from outlet.media automatically), let's use outlet.media[0]
  };
};

export const parseCoworkerRate = (
  space: CompleteSpace,
  resource: CoworkerResources,
  capacity: number
): { mode: Rate["mode"]; price: number } => {
  if (resource === "meeting_rooms") {
    return {
      mode: "quote",
      price: 0,
    };
  }

  let price: number = 0;
  let priceMode: Rate["mode"] = "day";
  const resourcePrice = space.memberships[resource]!.filter(
    (desk) => desk.capacity === capacity
  );

  /*
    hotdesk
    - daily
    - (weekly/5)+30%
    - (monthly/20)+30%

    anything else
    - hourly, daily or get quote

    prices in membership field are already sorted:
    1 Day price > Multiple Days price > 1 Month price > .. > 1 Year > ...
    so once we set with the smallest denomination of time qty, we can stop
   */
  for (const desk of resourcePrice) {
    if (!price && desk.duration_metric === "day") {
      price = desk.price / parseInt(desk.duration_qty, 10); // Average daily pricing if duration_qty > 1 day for a given price
    } else if (
      !price &&
      desk.duration_metric === "week" &&
      resource === "hot_desks"
    ) {
      price = (desk.price / parseInt(desk.duration_qty, 10) / 5) * 1.3;
    } else if (
      !price &&
      desk.duration_metric === "month" &&
      resource === "hot_desks"
    ) {
      price = (desk.price / parseInt(desk.duration_qty, 10) / 20) * 1.3;
    } else if (!price && resource !== "hot_desks") {
      priceMode = "quote";
      price = 0;
    }
  }

  return {
    mode: priceMode,
    price,
  };
};

export const parseCoworkerData = async (
  cityCode: string,
  brandsWithListings: Record<string, CompleteSpace[]>
) => {
  const parsedStaytionObj: StaytionObject = [];

  for (const brandName of Object.keys(brandsWithListings)) {
    const brandOutlets: Outlet[] = [];

    for (const space of brandsWithListings[brandName]) {
      const outletListings: Listing[] = [];

      (
        Object.keys(COWORKER_RESOURCES) as Array<
          keyof typeof COWORKER_RESOURCES
        >
      ).map(async (resource) => {
        if (resource === "meeting_rooms") {
          for (const { name, pax } of space.meetingRooms) {
            const coworkerRate = parseCoworkerRate(space, "meeting_rooms", pax);
            const rate = createRate(coworkerRate);
            const coworkerListing = parseCoworkerListing(space, name, pax);
            const listing = await createListing(coworkerListing, [rate]);

            outletListings.push(listing);
          }
        } else {
          const resourceListings = groupBy(
            space.memberships[resource],
            (listing) => listing.capacity
          );
          for (const capacity of Object.keys(resourceListings)) {
            const coworkerRate = parseCoworkerRate(
              space,
              resource,
              parseInt(capacity, 10)
            );
            const rate = createRate(coworkerRate);
            const coworkerListing = parseCoworkerListing(
              space,
              COWORKER_RESOURCES[resource],
              parseInt(capacity, 10)
            );
            const listing = await createListing(coworkerListing, [rate]);

            outletListings.push(listing);
          }
        }
      });

      const outlet = await createOutlet(
        brandName,
        outletListings,
        cityCode,
        space.display_name,
        space.descriptions.find((desc) => desc.language === "English")
          ?.text_full ?? "",
        `${space.location.address_1.trim()} ${space.location.address_2.trim()}`,
        space.location.lng,
        space.location.lat,
        space.currency_code,
        parseOperatingHours(space),
        parseAmenities(space),
        space.images.map((image) => createSourceMedia(image.url_no_params))
      );

      brandOutlets.push(outlet);
    }

    // Modify rates to override outlet_id
    const updatedOutlets = brandOutlets.map((outlet) => ({
      ...outlet,
      listings: {
        data: outlet.listings.data.map((listing) => ({
          ...listing,
          rates: {
            data: listing.rates.data.map((rate) => ({
              ...rate,
              outlet_id: outlet.id,
            })),
          },
        })),
      },
    }));

    const brand = await createBrand(brandName, updatedOutlets);

    parsedStaytionObj.push(brand);
  }

  return parsedStaytionObj;
};
