export type CompleteSpace = Space & {
  operatingHours: {
    weekday: { open: string; close: string } | null;
    saturday: { open: string; close: string } | null;
    sunday: { open: string; close: string } | null;
  };
};

// Generated with QuickType.io
export type Data = {
  spaces: Space[];
  pagination: Pagination;
  markers: Marker[];
  counts: Counts;
};

export type Counts = {
  deskCount: number;
  loungeCount: number;
  meetingRoomCount: number;
  privateOfficeCount: number;
  virtualOfficeCount: number;
  numSpaces: number;
};

export type Marker = {
  cs_id: string;
  location: MarkerLocation;
};

export type MarkerLocation = {
  lat: string;
  lng: string;
};

export type Pagination = {
  pageNum: number;
  perPage: string;
  numPages: number;
  currentPageNum: number;
};

export type Space = {
  id: string;
  iwg_id: null | string;
  name: string;
  space_url: string;
  city_lat: string;
  city_lng: string;
  rooms: null | string;
  desks: null | string;
  offices: null | string;
  capacity: null | string;
  amenities_ids: null | string;
  main_image: MainImage;
  main_unix: null | string;
  created_date: Date;
  currency_id: string;
  min_price: null | string;
  is_new: string;
  is_accs: string;
  deposit: null | string;
  is_verified: null | string;
  is_tours_enabled: boolean;
  is_free_day_pass_enabled: string;
  is_buy_day_pass_enabled: string;
  is_reservations_enabled: null | string;
  is_deleted: string;
  is_closed: string;
  claim_date: Date | null;
  is_claimed: null | string;
  is_global_pass_enabled: string;
  grandfathered_receive_full_leads: null | string;
  is_tedx: string;
  has_broker_agreement: string;
  database_time: string;
  cmca_winner: null | string;
  hot_desk_hour_price: null | string;
  hot_desk_day_price: null | string;
  hot_desk_week_price: null | string;
  hot_desk_month_price: null | string;
  hot_desk_year_price: null;
  dedicated_desk_hour_price: null;
  dedicated_desk_day_price: null | string;
  dedicated_desk_week_price: null | string;
  dedicated_desk_month_price: null | string;
  dedicated_desk_year_price: null;
  buy_day_pass_price: null | string;
  bdp_access: BdpAccess | null;
  currency_code: CurrencyCode;
  currency_to_usd_value: string;
  is_lounge: boolean;
  rate_2: null;
  rate_3: null;
  rate_6: null;
  rate_8: null;
  rate_12: null;
  location: SpaceLocation;
  profile_url_full: string;
  profile_url_relative: string;
  profile_image_url: string;
  amenities_by_categories: any[];
  buy_day_pass_enabled: boolean;
  list_pricing: ListPricing;
  memberships: Memberships;
  reviews_summary: ReviewsSummary;
  capacity_readable: string;
  subscription: Subscription;
  isSubscribed: boolean;
  booking_types: Booking;
  booking_button_name: Booking;
  show_popular: boolean;
  lounge_pricing: LoungePricing;
  descriptions: Description[];
  corporate_count: number;
  images: Image[];
  resource_types: ResourceTypeElement[];
  max_meeting_room_capacity: number;
  display_name: string;
};

export enum BdpAccess {
  Oh = "OH",
}

export enum Booking {
  BookingEnquiry = "BOOKING ENQUIRY",
}

export enum CurrencyCode {
  Thb = "THB",
}

export type Description = {
  text_full: string;
  language: Language;
  country_code: DescriptionCountryCode;
};

export enum DescriptionCountryCode {
  GB = "gb",
  Th = "th",
}

export enum Language {
  Arabic = "Arabic",
  English = "English",
}

export type Image = {
  url: string;
  url_no_params: string;
  width: number;
  height: number;
  srcset: string;
  sizes: string;
};

export type ListPricing = {
  default: Day | null;
  buy_day_pass: BuyDayPass;
  hot_desk: Desk | null;
  dedicated_desk: Desk | null;
  private_office: null;
  meeting_room: null;
  virtual_office: null;
};

export type BuyDayPass = {
  day: Day;
};

export type Day = {
  resource_type: DayResourceType;
  duration: Duration;
  price: string;
  price_currency: string;
  price_usd: number;
};

export enum Duration {
  Day = "day",
  Month = "month",
  Week = "week",
  Year = "year",
}

export enum DayResourceType {
  DedicatedDesk = "Dedicated Desk",
  HotDesk = "Hot Desk",
}

export type Desk = {
  month?: Day;
  day?: Day;
  week?: Day;
};

export type SpaceLocation = {
  address_1: string;
  address_2: string;
  country_name: CountryName;
  country_code: LocationCountryCode;
  country_url: CountryURL;
  state_code: null;
  state_name: null;
  state_url: null;
  city_name: CityName;
  city_url: CityURL;
  city_lat: string;
  city_lng: string;
  lat: string;
  lng: string;
};

export enum CityName {
  Bangkok = "Bangkok",
  Chonburi = "Chonburi",
  Pattaya = "Pattaya",
  Samutprakarn = "Samutprakarn",
}

export enum CityURL {
  Bangkok = "bangkok",
  Chonburi = "chonburi",
  Pattaya = "pattaya",
  Samutprakarn = "samutprakarn",
}

export enum LocationCountryCode {
  Th = "TH",
}

export enum CountryName {
  Thailand = "Thailand",
}

export enum CountryURL {
  Thailand = "thailand",
}

export type LoungePricing = {
  default: Default;
};

export type Default = {
  price: number;
};

export enum MainImage {
  JPEG = "jpeg",
  Jpg = "jpg",
  MainImageJPG = "JPG",
  PNG = "png",
}

export type Memberships = {
  hot_desks: DedicatedDesk[];
  dedicated_desks: DedicatedDesk[];
  private_offices: DedicatedDesk[];
  virtual_offices: any[] | VirtualOfficesClass;
};

export type DedicatedDesk = {
  capacity: number;
  duration_readable: DurationReadable;
  duration_qty: string;
  duration_metric: Duration;
  price: number;
  currency_code: CurrencyCode;
  price_usd: number;
  access_hours: AccessHours;
  qty?: number;
};

export enum AccessHours {
  ReceptionHours = "Reception Hours",
  The24Hours = "24 Hours",
}

export enum DurationReadable {
  The18Months = "18 Months",
  The1Day = "1 Day",
  The1Month = "1 Month",
  The1Week = "1 Week",
  The1Year = "1 Year",
  The2Years = "2 Years",
  The3Months = "3 Months",
  The6Months = "6 Months",
}

export type VirtualOfficesClass = {
  price: number;
  currency_code: CurrencyCode;
  price_usd: number;
};

export enum ResourceTypeElement {
  DedicatedDesks = "Dedicated Desks",
  HotDesks = "Hot Desks",
  PrivateWorkspace = "Private Workspace",
  VirtualOffice = "Virtual Office",
}

export type ReviewsSummary = {
  review_count: number | string;
  overall_rating_data: OverallRatingData;
};

export type OverallRatingData = {
  rating: null | string;
  whole: number | null | string;
  decimal: number | string;
  use_half_star: boolean;
};

export type Subscription = {
  plan: Plan;
  start_date: null | string;
  end_date: null | string;
};

export enum Plan {
  AllInclusive2022 = "all-inclusive-2022",
  Combo = "combo",
  Empty = "",
  Free = "free",
  Pro2022 = "pro-2022",
}
