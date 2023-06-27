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

// FIXME INCORRECT
export const COWORKER_AMENITIES: Record<
  string,
  (typeof AMENITIES)[keyof typeof AMENITIES]
> = {
  "1": AMENITIES.WIFI,
  "2": AMENITIES.AIR_CONDITIONING,
  "3": AMENITIES.HEATING,
  // 4: standing desks
  // 5: bean bags
  // 6: ergonomic chairs
  // 7: bosu ball chairs
  // 8: hammocks
  // 9: events
  // 10: community lunches
  // 11: community drinks
  // 12: facebook group for members
  // 13: accelerator programs
  // 14: community app
  // 15: incubator programs
  // 16: mentorship programs
  // 17: pitching events
  // 18: slack channel for members
  // 19: toastmasters
  // 20: dual/single monitors
  // 21: sound recording equipment
  // 22: video recording equipment
  "23": AMENITIES.PRINTER,
  // 24: scanner
  // 25: photocopier
  // 26: 3d printer
  "27": AMENITIES.COMPUTER, // PCs
  "28": AMENITIES.COMPUTER, // Macs
  // 29: Apple tv
  // 30: AR equipment
  // 31: chromecast
  // 32: drone
  // 33: green screen
  // 34: microphone
  // 35: photo studio
  // 36: professional lighting equipment
  "37": AMENITIES.PROJECTOR,
  // 38: recording studio
  // 39: screen printer
  "40": AMENITIES.LOUNGE_AREA,
  // 41: outdoor terrace
  "42": AMENITIES.SWIMMING_POOL,
  // 43: meditation room
  // 44: nap room
  // 45: yoga studio
  // 46: kitchen
  // 47: podcasting room
  // 48: co-living accommodation
  "49": AMENITIES.PHONE_BOOTH,
  // 50: childcare
} as const;

export const COWORKER_RESOURCES: Record<CoworkerResources, string> = {
  hot_desk: "Hot Desk",
  dedicated_desk: "Dedicated Desk",
  private_office: "Private Office",
  meeting_room: "Meeting Room",
};

export type CoworkerResources =
  | "hot_desk"
  | "dedicated_desk"
  | "private_office"
  | "meeting_room";
