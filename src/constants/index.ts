export const AVOID_BRAND_NAMES = ["justco", "regus", "wework"];

export const COUNTRIES: Record<string, string> = {
  Singapore: "SGP",
  Malaysia: "MYS",
  Thailand: "THA",
} as const;

export const CITIES: Record<
  string,
  {
    country: string;
    latitude: number;
    longitude: number;
    timezone_utc: string;
  }
> = {
  "SGP/singapore": {
    country: COUNTRIES.Singapore,
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "MYS/kuala_lumpur": {
    country: COUNTRIES.Malaysia,
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "MYS/johor_bahru": {
    country: COUNTRIES.Malaysia,
    latitude: 0,
    longitude: 0,
    timezone_utc: "+0800",
  },
  "THA/bangkok": {
    country: COUNTRIES.Thailand,
    latitude: 13.7563309,
    longitude: 100.5017651,
    timezone_utc: "+0700",
  },
} as const;

export const CURRENCIES: Record<string, string> = {
  HKD: "HKD",
  THB: "THB",
  MYR: "MYR",
  AUD: "AUD",
  USD: "USD",
  JPY: "JPY",
  SGD: "SGD",
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
  Others: "others",
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
  | "Others";
