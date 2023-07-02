import { v4 as uuidv4 } from "uuid";
import { CITIES, COWORKER_AMENITIES, CoworkerResources } from "../constants";
import { slugStringDB } from "../utils/slugStringDB";
import {
  Outlet,
  type Brand,
  Rate,
  Listing,
  OpeningHours,
  OpeningHourDay,
} from "../types/staytion";
import { CompleteSpace } from "../types/coworker";

export const parseCityCode = (
  cityCode: string
): { country: string; city: string } => {
  if (!(cityCode in CITIES)) {
    throw new Error(`${cityCode} not supported by Staytion yet`);
  }

  const splitCityCode = cityCode.split("/");

  if (splitCityCode.length !== 2) {
    throw new Error("Invalid city code format");
  }

  return { country: splitCityCode[0], city: splitCityCode[1] };
};

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
    // eslint-disable-next-line no-restricted-syntax
    for (const amenity of space.amenities_ids.split(",")) {
      if (COWORKER_AMENITIES[amenity]) {
        outletAmenities.push(COWORKER_AMENITIES[amenity]);
      }
    }
  }

  return outletAmenities;
};

export const createBrand = async (brandName: string): Promise<Brand> => {
  const brandId = uuidv4();

  const brandSlug = await slugStringDB(brandName, "brands", brandId);
  return {
    id: brandId,
    slug: brandSlug,

    name: brandName,
    description: "", // ? Description is technically not being used at the moment in UI anyway
    website: "", // TODO What kind of website information can we scrape from the listing page on coworker

    platform_fee_percentage: 0,
    fixed_fee_per_transactions: 0, // ? 10?
    membership_fee_per_transaction: null,

    enabled: false,
    verified: false,
    claimable: true,
  };
};

// Currently coworker-specific
export const createOutlet = async (
  brand: Brand,
  space: CompleteSpace,
  cityCode: string
): Promise<Outlet> => {
  const { country } = parseCityCode(cityCode);

  const outletName = `${brand.name} @ ${space.display_name}`;
  const outletId = uuidv4();
  const outletSlug = await slugStringDB(outletName, "outlets", outletId);
  return {
    id: outletId,
    slug: outletSlug,
    brand_id: brand.id,

    name: outletName,
    description:
      space.descriptions.find((desc) => desc.language === "English")
        ?.text_full ?? "",

    full_address: `${space.location.address_1}, ${space.location.address_2}`,
    city_area_code: null,
    city_code: cityCode,
    country_code: country,
    geoloc: {
      type: "Point",
      coordinates: [space.location.lng, space.location.lat],
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:EPSG::4326" },
      },
    },
    currency_code: space.currency_code,
    timezone_gmt: CITIES[cityCode].timezone_utc,

    opening_hours: parseOperatingHours(space),
    amenities: parseAmenities(space),
    media: [],

    customer_support_email: "alex@gostaytion.com",
    default_email: ["alex@gostaytion.com", "enquiry@gostaytion.com"],

    platform_fee_percentage: 15,
    fixed_fee_per_transaction: 0,
    membership_fee_per_transaction: null, // ? 250?

    enabled: true,
  };
};

export const createListing = async (
  outlet: Outlet,
  listingName: string
): Promise<Listing> => {
  const listingId = uuidv4();
  const listingSlug = await slugStringDB(listingName, "listings", listingId);
  return {
    id: listingId,
    slug: listingSlug,
    outlet_id: outlet.id,

    name: listingName,
    description: outlet.description,

    opening_hours: null, // No need to override outlet's opening hours
    amenities: [], // TODO Use outlet info
    media: [], // TODO

    available_for_purchase: true,
    request_based_booking: true,
    auto_cancel_booking_duration: 5,
    category_tags: [], // TODO

    enabled: true,
  };
};

// Currently coworker-specific
export const createRate = async (
  outlet: Outlet,
  listing: Listing,
  space: CompleteSpace,
  resource: CoworkerResources
): Promise<Rate> => {
  const rateId = uuidv4();

  let price: number | null = null;
  let priceMode: Rate["mode"] = "day";
  const resourcePrice = space.list_pricing[resource]!;

  if (resourcePrice.day) {
    price = parseInt(resourcePrice.day.price.replace(",", ""), 10);
  } else if (resource === "hot_desk" && resourcePrice.week) {
    price = (parseInt(resourcePrice.week.price.replace(",", ""), 10) / 5) * 1.3;
  } else if (resource === "hot_desk" && resourcePrice.month) {
    price =
      (parseInt(resourcePrice.month.price.replace(",", ""), 10) / 5) * 1.3;
  } else {
    priceMode = "quote";
    price = null;
  }

  return {
    id: rateId,
    listing_id: listing.id,
    outlet_id: outlet.id,

    mode: priceMode,
    price, // Double check this
    price_per_additional_pax: null,
    max_pax: null,
  };
};
