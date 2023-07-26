import { gqlServerClient } from "../helpers/graphqlClient";
import { Media, StaytionObject } from "../types/staytion";
import { JsonifyToFile } from "../utils/writeFile";
import { INJECT_BRAND } from "./queries";
import { uploadOrGetFromCache } from "./uploadImage";
import images from "../../images.json";

export const inject = async (data: StaytionObject): Promise<void> => {
  // Upload photos first
  // Load images DB
  const imagesCache = { ...(<{ [url: string]: Media }>images) };

  const updatedData = await Promise.all(
    data.map(async (brand) => ({
      ...brand,
      outlets: {
        data: await Promise.all(
          brand.outlets.data.map(async (outlet) => ({
            ...outlet,
            media: await Promise.all(
              outlet.media.map(async (media) =>
                uploadOrGetFromCache(media, imagesCache)
              )
            ),
            listings: {
              data: await Promise.all(
                outlet.listings.data.map(async (listing) => ({
                  ...listing,
                  media: await Promise.all(
                    listing.media.map(async (media) =>
                      uploadOrGetFromCache(media, imagesCache)
                    )
                  ),
                }))
              ),
            },
          }))
        ),
      },
    }))
  );

  // Update images DB
  JsonifyToFile(imagesCache, "images");

  // TODO Chunk object injection
  await Promise.all(
    updatedData.map((brand) =>
      gqlServerClient.request(INJECT_BRAND, { object: brand })
    )
  );
};
