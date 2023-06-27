import { AMENITIES } from "../constants";

export type Brand = {
  id: string;
  slug: string;

  name: string;
  description?: string | null;
  website?: string;

  enabled?: boolean | null;
  verified?: boolean | null;
};

export type Outlet = {
  id: string;
  slug: string;
  brand_id: string;

  name: string;
  description?: string;

  full_address: string;
  city_code: string; // THA/bangkok
  city_area_code: null;
  country_code: string; // ISO country code
  geoloc: Location;
  currency_code: string;
  timezone_gmt: string;

  opening_hours?: {
    monday?: {};
    tuesday?: {};
    wednesday?: {};
    thursday?: {};
    friday?: {};
    saturday?: {};
    sunday?: {};
  };
  amenities: Amenity[];
  media?: {};

  customer_support_email?: string | null;
  default_email?: string | null;

  fixed_fee_per_transaction?: any | null;
  membership_fee_per_transaction?: any | null;
  platform_fee_percentage?: any | null;

  enabled?: boolean | null;
};

export type Listing = {
  id: string;
  slug: string;
  outlet_id: string;

  name: string;
  description?: string;

  opening_hours?: {};
  amenities?: {};
  media?: {};

  available_for_purchase: boolean;
  request_based_booking: boolean;
  auto_cancel_booking_duration: number | null;
  category_tags: CategoryTag[];

  enabled: boolean;
};

export type Rate = {
  id: string;
  listing_id: string;
  outlet_id: string;

  mode: "hour" | "day" | "quote";
  price?: any | null;
  price_per_additional_pax?: any | null;
  max_pax?: number | null;
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

export const CategoryTag: Record<string, string> = {
  "Hot Desk": "hotdesk",
  Meeting: "meeting",
  Studio: "studio",
  Dance: "dance",
  Photography: "photography",
  Event: "event",
  Art: "art",
  Music: "music",
  Workshop: "workshop",
  Cafe: "cafe",
  Others: "others",
};

export type StaytionObject = {
  brands: Brand[];
  outlets: Outlet[];
  listings: Listing[];
  rates: Rates[];
};
