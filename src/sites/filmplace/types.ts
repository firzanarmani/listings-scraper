export type Filmplace = {
  current_page: number;
  data: Datum[];
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
};

export type Datum = {
  id: number;
  name: string;
  room_type_name: RoomType;
  category_type_name: CategoryTypeName;
  booking_type: BookingType;
  cancellation_policy: CancellationPolicy;
  status: Status;
  total_rating: string;
  rating: string;
  link: string;
  is_saved: boolean;
  wishlist_id: number;
  image_src: string;
  photo_name: string;
  url: string;
  latitude: string;
  longitude: string;
  city: City;
  state: string;
  country_name: City;
  photos_list: Photos[];
  photos_360: Photos[];
  price: string;
  guests_text: string;
  room_type_text: RoomType;
  currency_code: CurrencyCode;
  currency_symbol: CurrencySymbol;
  price_text: string;
  instant_book: boolean;
  is_verified: boolean;
  city_name: City;
  price_display_text: string;
  is_pro_host: boolean;
};

export type Description = {
  about: string;
  spaceInfo: string;
  amenities: string[];
  description: string;
  houseRules: string;
  prices: string;
};

export type CompleteDatum = Datum & {
  description: Description;
};

export enum BookingType {
  InstantBook = "instant_book",
  RequestBook = "request_book",
}

export enum CancellationPolicy {
  Flexible = "flexible",
  Moderate = "moderate",
  Strict = "strict",
}

export enum CategoryTypeName {
  EventStudio = "Event/Studio",
  Housing = "Housing",
  Workspace = "Workspace",
}

export enum City {
  Singapore = "Singapore",
}

export enum CurrencyCode {
  Sgd = "SGD",
}

export enum CurrencySymbol {
  Sgd = "SGD$",
}

export type Photos = {
  id: number;
  image_src: string;
  description: string;
};

export enum RoomType {
  EntirePlace = "Entire Place",
  PrivateArea = "Private Area",
}

export enum Status {
  Listed = "listed",
}
