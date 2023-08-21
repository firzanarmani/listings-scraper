import { gqlServerClient } from "../helpers/graphqlClient";
import { Listing, Media, Outlet, StaytionObject } from "../types/staytion";
import { JsonifyToFile } from "../utils/writeFile";
import { GET_BRAND, INJECT_BRAND, INJECT_OUTLETS } from "../queries";
import { uploadOrGetFromCache } from "./uploadImage";
import images from "../../images.json";
import chunkArray from "../utils/chunk";
import { ListingsProvider } from "../constants";

export const inject = async (
  data: StaytionObject,
  provider: ListingsProvider
): Promise<void> => {
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

  JsonifyToFile(updatedData, "test");

  console.log(updatedData.length);

  // If provider is Filmplace, check if Filmplace exists on the server,
  // If yes, then add just add on to the existing brand
  if (provider === "Filmplace") {
    const existingBrands = await gqlServerClient.request<
      { brands: { id: string }[] },
      { brandName: String }
    >(GET_BRAND, { brandName: "Filmplace" });

    console.log(existingBrands);

    if (updatedData.length > 1 || updatedData[0].name !== "Filmplace") {
      throw Error("Invalid Filmplace object");
    }

    if (existingBrands.brands.length > 1) {
      throw Error("More than one Filmplace brand in database");
    }

    if (existingBrands.brands.length === 0) {
      const uploadChunks = chunkArray(updatedData, 10);
      for (const chunk of uploadChunks) {
        await Promise.all(
          chunk.map((brand) =>
            gqlServerClient.request(INJECT_BRAND, { object: brand })
          )
        );
      }
    } else {
      const updatedOutlets: Outlet[] = updatedData[0].outlets.data.map(
        (outlet) => ({
          ...outlet,
          brand_id: existingBrands.brands[0].id,
        })
      );
      const uploadChunks = chunkArray(updatedOutlets, 10);
      await Promise.all(
        uploadChunks.map((outlets) =>
          gqlServerClient.request(INJECT_OUTLETS, { objects: outlets })
        )
      );
    }
  } else {
    const uploadChunks = chunkArray(updatedData, 10);
    for (const chunk of uploadChunks) {
      await Promise.all(
        chunk.map((brand) =>
          gqlServerClient.request(INJECT_BRAND, { object: brand })
        )
      );
    }
  }
};
