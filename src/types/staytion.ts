import { AMENITIES } from "../constants";

export type StaytionObject = Brand[];

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
  injected: boolean;

  outlets: { data: Outlet[] };
};

export type Outlet = {
  id: string;
  slug: string;

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
  media: (Media | null)[];

  customer_support_email: string;
  default_email: string[];

  platform_fee_percentage: number | null;
  fixed_fee_per_transactions: number | null;
  membership_fee_per_transaction: number | null;

  partner_accesses: {
    data: PartnerAccess[];
  };

  enabled: boolean;
  injected: boolean;

  listings: { data: Listing[] };
};

export type Listing = {
  id: string;
  slug: string;

  name: string;
  description: string;

  opening_hours: OpeningHours | null;
  amenities: Amenity[];
  media: (Media | null)[];

  available_for_purchase: boolean;
  request_based_booking: boolean;
  auto_cancel_booking_duration: number | null;
  default_allotments_per_day: number;
  category_tags: string[];

  enabled: boolean;
  injected: boolean;

  rates: { data: Rate[] };

  redirect_url: string | null;
  redirect_provider: string | null;
};

export type Rate = {
  id: string;
  outlet_id: string;

  mode: "hour" | "day" | "quote";
  price: number;
  price_per_additional_pax: number | null;
  max_pax: number | null;
};

export type Location = {
  type: "Point";
  coordinates: [number, number]; // [lon, lat]
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
  filename?: string | null;
};

export type PartnerAccess = {
  id: string;

  partner_user_uid: string;
  access_control: string[];
  email: string;
};
