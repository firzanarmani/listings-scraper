import {
  AMENITIES,
  CATEGORY_TAGS,
  CITIES,
  COUNTRY_CURRENCY,
  Cities,
} from "../../constants";
import {
  createBrand,
  createListing,
  createOutlet,
  createRate,
  createSourceMedia,
  remapRateOutletId,
} from "../../parser/utils";
import { Outlet, StaytionObject } from "../../types/staytion";
import { CompleteDatum, Description } from "./types";

const formatFilmplaceDescription = (desc: Description) =>
  `${desc.about}

${desc.spaceInfo}

${
  desc.prices.trim().length > 0
    ? `- Prices -
  ${desc.prices}`
    : ""
}

${
  desc.description.trim().length > 0
    ? `- Description -
${desc.description}`
    : ""
}

${
  desc.houseRules.trim().length > 0
    ? `- House Rules -
${desc.houseRules}`
    : ""
}`;

export const parseFilmplaceData = async (
  cityCode: Cities,
  listings: Record<string, CompleteDatum[]>,
  partner: { uid: string; email: string }
) => {
  const parsedStaytionObj: StaytionObject = [];

  for (const brandName of Object.keys(listings)) {
    const brandOutlets: Outlet[] = [];

    for (const space of listings[brandName]) {
      const hourRate = createRate({
        mode: "hour",
        price: parseInt(space.price, 10),
      });
      const quoteRate = createRate({
        mode: "quote",
        price: 0,
      });

      const listing = await createListing(
        {
          name: space.name,
          description: space.room_type_name,
          amenities: [AMENITIES.WIFI, AMENITIES.AIR_CONDITIONING], // TODO Need to scrape
          categoryTags: [CATEGORY_TAGS.Filming],
          media: [createSourceMedia(space.image_src)],
          redirect_url: `${space.url}?ref=staytion`,
          redirect_provider: "Filmplace",
        },
        [hourRate, quoteRate]
      );

      const outlet = await createOutlet(
        brandName,
        [listing],
        cityCode,
        space.name,
        formatFilmplaceDescription(space.description),
        `${space.city}, ${space.state}, ${space.country_name}`,
        space.longitude,
        space.latitude,
        COUNTRY_CURRENCY[CITIES[cityCode].country],
        {
          monday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          tuesday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          wednesday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          thursday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          friday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          saturday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
          sunday: {
            active: true,
            sets: [{ open: "00:00", close: "23:59" }],
          },
        },
        [AMENITIES.WIFI, AMENITIES.AIR_CONDITIONING],
        space.photos_list.map((image) => createSourceMedia(image.image_src)),
        partner
      );

      brandOutlets.push(outlet);
    }

    // Modify rates to override outlet_id and add partner access to alex@gostaytion.com
    const updatedOutlets = remapRateOutletId(brandOutlets);

    const brand = await createBrand(brandName, updatedOutlets);

    parsedStaytionObj.push(brand);
  }

  return parsedStaytionObj;
};
