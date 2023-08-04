import { v4 as uuidv4 } from "uuid";
import { AMENITIES, CITIES } from "../constants";
import { slugStringDB } from "../utils/slugStringDB";
import {
  Outlet,
  type Brand,
  Rate,
  Listing,
  Media,
  OpeningHours,
  PartnerAccess,
} from "../types/staytion";

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

export const createSourceMedia = (url: string): Media => ({
  url,
  type: "image/webp",
  public: true,
  filename: url.replace(/^https:\/\//, ""),
});

export const createBrand = async (
  brandName: string,
  outlets: Outlet[]
): Promise<Brand> => {
  const brandId = uuidv4();

  const brandSlug = await slugStringDB(brandName, "brands", brandId);
  return {
    id: brandId,
    slug: brandSlug,

    name: brandName,
    description: "", // ? Description is technically not being used at the moment in UI anyway
    website: "", // TODO What kind of website information can we scrape from the listing page on coworker

    platform_fee_percentage: 15,
    fixed_fee_per_transactions: 0,
    membership_fee_per_transaction: null,

    enabled: false,
    verified: false,
    claimable: true,
    injected: true,

    outlets: { data: outlets },
  };
};

const createPartnerAccess = (
  partner_uid: string,
  email: string
): PartnerAccess => {
  const partnerAccessId = uuidv4();

  return {
    id: partnerAccessId,

    partner_user_uid: partner_uid,
    email,

    access_control: ["all"],
  };
};

export const createOutlet = async (
  brandName: string,
  listings: Listing[],
  cityCode: string,
  displayName: string,
  description: string,
  fullAddress: string,
  longitude: string,
  latitude: string,
  currencyCode: string,
  openingHours: OpeningHours,
  amenities: string[],
  media: Media[],
  partner: { uid: string; email: string }
): Promise<Outlet> => {
  const { country } = parseCityCode(cityCode);

  const outletName = `${brandName} @ ${displayName}`;
  const outletId = uuidv4();
  const outletSlug = await slugStringDB(outletName, "outlets", outletId);
  return {
    id: outletId,
    slug: outletSlug,

    name: outletName,
    description,

    full_address: fullAddress,
    city_area_code: null,
    city_code: cityCode,
    country_code: country,
    geoloc: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:EPSG::4326" },
      },
    },
    currency_code: currencyCode,
    timezone_gmt: CITIES[cityCode].timezone_utc,

    opening_hours: openingHours,
    amenities:
      amenities.length === 0
        ? [AMENITIES.WIFI, AMENITIES.AIR_CONDITIONING]
        : amenities,
    media,

    customer_support_email: "enquiry@gostaytion.com",
    default_email: ["alex@gostaytion.com", "enquiry@gostaytion.com"],

    platform_fee_percentage: 15,
    fixed_fee_per_transactions: 0,
    membership_fee_per_transaction: 250,

    enabled: true,
    injected: true,

    listings: { data: listings },
    partner_accesses: {
      data: [createPartnerAccess(partner.uid, partner.email)],
    },
  };
};

export const createListing = async (
  {
    name,
    description,
    amenities,
    media,
    categoryTags,
  }: {
    name: string;
    description: string;
    amenities: string[];
    media: Media[];
    categoryTags: string[];
  },
  rates: Rate[]
): Promise<Listing> => {
  const listingId = uuidv4();
  const listingSlug = await slugStringDB(name, "listings", listingId);

  return {
    id: listingId,
    slug: listingSlug,

    name,
    description,

    opening_hours: null, // ? No need to override outlet's opening hours, unless 24h instead of operating hours?
    amenities,
    category_tags: categoryTags,
    media,

    available_for_purchase: true,
    request_based_booking: true,
    auto_cancel_booking_duration: 5,
    default_allotments_per_day: 0,

    enabled: true,
    injected: true,
    rates: { data: rates },
  };
};

export const createRate = ({
  mode,
  price,
}: {
  mode: Rate["mode"];
  price: number;
}): Rate => {
  const rateId = uuidv4();

  return {
    id: rateId,
    outlet_id: "", // Default value, will override later

    mode,
    price,
    price_per_additional_pax: null,
    max_pax: null,
  };
};
