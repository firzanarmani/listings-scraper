import { v4 as uuidv4 } from "uuid";
import { AMENITIES, CITIES, CoworkerResources } from "../constants";
import { slugStringDB } from "../utils/slugStringDB";
import { Outlet, type Brand, Rate, Listing } from "../types/staytion";
import { Space } from "../types/coworker";

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

export const createBrand = async (brandName: string): Promise<Brand> => {
  const brandId = uuidv4();

  const brandSlug = await slugStringDB(brandName, "brands", brandId);
  return {
    name: brandName,
    id: brandId,
    slug: brandSlug,

    enabled: false,
    verified: false,
  };
};

// Currently coworker-specific
export const createOutlet = async (
  brand: Brand,
  space: Space,
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
    currency_code: space.currency_code, // Validation here
    timezone_gmt: CITIES[cityCode].timezone_utc,

    amenities:
      space.amenities_ids?.split(",").map((amenity) => AMENITIES[amenity]) ||
      [],

    customer_support_email: "alex@gostaytion.com",
    default_email: "alex@gostaytion.com",

    fixed_fee_per_transaction: 0,
    membership_fee_per_transaction: null,
    platform_fee_percentage: 15,

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
  };
};

// Currently coworker-specific
export const createRate = async (
  outlet: Outlet,
  listing: Listing,
  space: Space,
  resource: CoworkerResources
): Promise<Rate> => {
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

  const rateId = uuidv4();
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
