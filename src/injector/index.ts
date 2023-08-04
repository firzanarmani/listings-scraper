import { gqlServerClient } from "../helpers/graphqlClient";
import { Listing, Media, Outlet, StaytionObject } from "../types/staytion";
import { JsonifyToFile } from "../utils/writeFile";
import { INJECT_BRAND } from "./queries";
import { uploadOrGetFromCache } from "./uploadImage";
import images from "../../images.json";
import chunkArray from "../utils/chunk";

export const inject = async (data: StaytionObject): Promise<void> => {
  // Upload photos first
  // Load images DB
  const imagesCache = { ...(<{ [url: string]: Media }>images) };

  const updatedData: StaytionObject = [];

  for (const brand of data) {
    const updatedOutlets: Outlet[] = [];

    for (const outlet of brand.outlets.data) {
      const updatedListings: Listing[] = [];

      const outletImages = await Promise.all(
        outlet.media.map((media) => uploadOrGetFromCache(media, imagesCache))
      );

      // Skip outlet if no media
      if (outletImages.filter((image) => image !== null).length === 0) {
        break;
      }

      for (const listing of outlet.listings.data) {
        const listingImages = await Promise.all(
          listing.media.map((media) => uploadOrGetFromCache(media, imagesCache))
        );

        updatedListings.push({ ...listing, media: listingImages });
      }

      updatedOutlets.push({
        ...outlet,
        media: outletImages,
        listings: { data: updatedListings },
      });
    }

    // Skip brand if no outlets
    if (updatedOutlets.length > 0) {
    updatedData.push({ ...brand, outlets: { data: updatedOutlets } });
    }
  }

  // Update images DB
  JsonifyToFile(imagesCache, "images");

  const uploadChunks = chunkArray(updatedData, 10);
  for (const chunk of uploadChunks) {
  await Promise.all(
      chunk.map((brand) =>
      gqlServerClient.request(INJECT_BRAND, { object: brand })
    )
  );
  }
};
