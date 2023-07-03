import { AMENITIES } from "../constants";

export type Brand = {
  id: string;
  slug: string;

  name: string;
  description: string;
  website: string;

  platform_fee_percentage: number | null;
  fixed_fee_per_transactions: number | null;
  membership_fee_per_transaction: number | null;

  enabled: boolean;
  verified: boolean;
  claimable: boolean;
};

export type Outlet = {
  id: string;
  slug: string;
  brand_id: string;

  name: string;
  description: string;

  full_address: string;
  city_code: string; // THA/bangkok
  city_area_code: null;
  country_code: string; // ISO country code
  geoloc: Location;
  currency_code: string;
  timezone_gmt: string;

  opening_hours: OpeningHours | null;
  amenities: Amenity[];
  media: Media[];

  customer_support_email: string;
  default_email: string[];

  platform_fee_percentage: number | null;
  fixed_fee_per_transaction: number | null;
  membership_fee_per_transaction: number | null;

  enabled: boolean;
};

export type Listing = {
  id: string;
  slug: string;
  outlet_id: string;

  name: string;
  description: string;

  opening_hours: OpeningHours | null;
  amenities: Amenity[];
  media: Media[];

  available_for_purchase: boolean;
  request_based_booking: boolean;
  auto_cancel_booking_duration: number | null;
  category_tags: string[];

  enabled: boolean;
};

export type Rate = {
  id: string;
  listing_id: string;
  outlet_id: string;

  mode: "hour" | "day" | "quote";
  price: number | null;
  price_per_additional_pax: number | null;
  max_pax: number | null;
};

export type Location = {
  type: "Point";
  coordinates: [string, string]; // [lat, lon] SWITCH THIS [lon, lat]
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
};

export type Amenity = (typeof AMENITIES)[keyof typeof AMENITIES];

export type OpeningHourDay = {
  sets: {
    open: string;
    close: string;
  }[];
  active: boolean;
};

export type OpeningHours = {
  monday?: OpeningHourDay;
  tuesday?: OpeningHourDay;
  wednesday?: OpeningHourDay;
  thursday?: OpeningHourDay;
  friday?: OpeningHourDay;
  saturday?: OpeningHourDay;
  sunday?: OpeningHourDay;
};

export type Media = {
  url: string;
  type: string;
  public: boolean;
  ref_id?: string | null;
};

export type StaytionObject = {
  brands: Brand[];
  outlets: Outlet[];
  listings: Listing[];
  rates: Rates[];
};
