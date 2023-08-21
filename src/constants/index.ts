export type ListingsProvider = "Coworker" | "Allospaces" | "Filmplace";

export const AVOID_BRAND_NAMES = ["justco", "regus", "wework"];

export type Countries =
  | "Singapore"
  | "Malaysia"
  | "Thailand"
  | "Indonesia"
  | "Philippines"
  | "South Korea";

export const COUNTRIES: Record<Countries, string> = {
  Singapore: "SGP",
  Malaysia: "MYS",
  Thailand: "THA",
  Indonesia: "IDN",
  Philippines: "PHL",
  "South Korea": "KOR",
} as const;

export const COUNTRY_CURRENCY: Record<Countries, Currencies> = {
  Singapore: "SGD",
  Malaysia: "MYR",
  Thailand: "THB",
  Indonesia: "IDR",
  Philippines: "PHP",
  "South Korea": "KRW",
};

export type Cities =
  | "SGP/singapore"
  | "MYS/kuala_lumpur"
  | "MYS/johor_bahru"
  | "THA/bangkok"
  | "IDN/jakarta"
  | "IDN/surabaya"
  | "IDN/bandung"
  | "IDN/bali"
  | "PHL/manila_city"
  | "PHL/taguig"
  | "PHL/makati"
  | "PHL/quezon_city"
  | "PHL/san_pedro_laguna"
  | "KOR/seoul"
  | "KOR/daejeon"
  | "MYS/perak";

export const CITIES: Record<
  Cities,
  {
    city: string;
    country: Countries;
    latitude: number;
    longitude: number;
    timezone_utc: string;
  }
> = {
  "SGP/singapore": {
    city: "Singapore",
    country: "Singapore",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "MYS/kuala_lumpur": {
    city: "Kuala Lumpur",
    country: "Malaysia",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "MYS/johor_bahru": {
    city: "Johor Bahru",
    country: "Malaysia",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "THA/bangkok": {
    city: "Bangkok",
    country: "Thailand",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  // TODO Indonesia - fix coords
  "IDN/jakarta": {
    city: "Jakarta",
    country: "Indonesia",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "IDN/surabaya": {
    city: "Surabaya",
    country: "Indonesia",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "IDN/bali": {
    city: "Bali",
    country: "Indonesia",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "IDN/bandung": {
    city: "Bandung",
    country: "Indonesia",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "PHL/manila_city": {
    city: "Manila City",
    country: "Philippines",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "PHL/quezon_city": {
    city: "Quezon City",
    country: "Philippines",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "PHL/makati": {
    city: "Makati",
    country: "Philippines",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "PHL/san_pedro_laguna": {
    city: "San Pedro Laguna",
    country: "Philippines",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "PHL/taguig": {
    city: "Taguig",
    country: "Philippines",
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
  "KOR/seoul": {
    city: "Seoul",
    country: "South Korea",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0900",
  },
  "KOR/daejeon": {
    city: "Daejeon",
    country: "South Korea",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0900",
  },
  "MYS/perak": {
    city: "Perak",
    country: "Malaysia",
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
} as const;

export type Currencies =
  | "HKD"
  | "THB"
  | "MYR"
  | "AUD"
  | "USD"
  | "JPY"
  | "SGD"
  | "KRW"
  | "PHP"
  | "IDR";

export const CURRENCIES: Record<string, string> = {
  HKD: "HKD",
  THB: "THB",
  MYR: "MYR",
  AUD: "AUD",
  USD: "USD",
  JPY: "JPY",
  SGD: "SGD",
  KRW: "KRW",
  IDR: "IDR",
};

export const AMENITIES: Record<string, string> = {
  WIFI: "wifi",
  TOILETRIES: "toiletries",
  SMOKING_ROOM: "smoking room",
  AIR_CONDITIONING: "air conditioning",
  SHOWER_FACILITIES: "shower facilities",
  BATHTUB: "bathtub",
  HAIRDRYER: "hairdryer",
  TOILET: "toilet",
  SAFETY_DEPOSIT_BOX: "safety deposit box",
  TELEVISION: "television",
  TELEPHONE: "telephone",
  WARDROBE: "wardrobe",
  IRONING_FACILITIES: "ironing facilities",
  SCENERY: "scenery",
  BALCONY: "balcony",
  DESK: "desk",
  SOUNDPROOFING: "soundproofing",
  SWIMMING_POOL: "swimming pool",
  COFFEE_MACHINE: "coffee machine",
  REFRIGERATOR: "refrigerator",
  MINIBAR: "minibar",
  ELECTRIC_KETTLE: "electric kettle",
  SOFA: "sofa",
  DINING_TABLE: "dining table",
  WATER_DISPENSER: "water dispenser",
  COOKING_FACILITIES: "cooking facilities",
  WASHING_MACHINE: "washing machine",
  HEATING: "heating",
  PETS_ALLOWED: "pets allowed",
  BIKE_RACK: "bike rack",
  CHAIR: "chair",
  CHARGING_PORT: "charging port",
  COMPUTER: "computer",
  DVD_PLAYER: "dvd player",
  FAX_MACHINE: "fax machine",
  FLIPCHART: "flipchart",
  GENERIC: "generic",
  GLASSWARE: "glassware",
  KARAOKE: "karaoke",
  LOCKER: "locker",
  LOUNGE_AREA: "lounge area",
  MICROWAVE: "microwave",
  PANTRY: "pantry",
  PARKING: "parking",
  PHONE_BOOTH: "phone booth",
  PRINTER: "printer",
  PROJECTOR: "projector",
  RECEPTIONIST: "receptionist",
  SLEEPING_PODS: "sleeping pods",
  SMART_TV: "smart tv",
  SOUND_SYSTEM: "sound system",
  STATIONARY: "stationary",
  TWENTY_FOUR_SEVEN_ACCESS: "twenty four seven access",
  WHEELCHAIR: "wheelchair",
  WHITEBOARD: "whiteboard",
} as const;

export const COWORKER_AMENITIES: Record<string, string> = {
  "1": AMENITIES.WIFI,
  "2": AMENITIES.LOUNGE_AREA,
  "4": AMENITIES.AIR_CONDITIONING,
  "5": AMENITIES.HEATING,
  "6": AMENITIES.COOKING_FACILITIES,
  "8": AMENITIES.DESKS, // Standing desks
  "11": AMENITIES.CHAIRS, // Beanbags
  "13": AMENITIES.SWIMMING_POOL,
  "14": AMENITIES.PARKING,
  "15": AMENITIES.WHEELCHAIR,
  "18": AMENITIES.CHAIRS, // Ergonomic chairs
  "32": AMENITIES.PRINTER,
  "37": AMENITIES.TWENTY_FOUR_SEVEN_ACCESS,
  "39": AMENITIES.PETS_ALLOWED,
  "40": AMENITIES.COMPUTER,
  "41": AMENITIES.COMPUTER,
  "42": AMENITIES.LOCKER,
  "46": AMENITIES.SHOWER_FACILITIES,
  "54": AMENITIES.BIKE_RACK,
  "55": AMENITIES.BIKE_RACK,
  "58": AMENITIES.CHAIRS, // Bosu ball chairs
  "73": AMENITIES.KARAOKE,
  "74": AMENITIES.WASHING_MACHINE, // Laundry service
  "78": AMENITIES.SOUND_SYSTEM,
  "79": AMENITIES.SLEEPING_PODS, // Nap room
  "85": AMENITIES.PHONE_BOOTH,
  "90": AMENITIES.PROJECTOR,
} as const;

export const COWORKER_RESOURCES: Record<CoworkerResources, string> = {
  hot_desks: "Hot Desk",
  dedicated_desks: "Dedicated Desk",
  private_offices: "Private Office",
  meeting_rooms: "Meeting Room",
};

export const CATEGORY_TAGS: Record<CategoryTags, string> = {
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
  Filming: "filming",
  Others: "others",
};

export const COUNTRY_MEMBERSHIP_FEE: Record<Countries, number> = {
  Singapore: 10,
  Malaysia: 10,
  Thailand: 250,
  Indonesia: 56714,
  Philippines: 0, // TODO
  "South Korea": 9862,
};

export type CoworkerResources =
  | "hot_desks"
  | "dedicated_desks"
  | "private_offices"
  | "meeting_rooms";

export type CategoryTags =
  | "Hot Desk"
  | "Meeting"
  | "Studio"
  | "Dance"
  | "Photography"
  | "Event"
  | "Art"
  | "Music"
  | "Workshop"
  | "Cafe"
  | "Filming"
  | "Others";
