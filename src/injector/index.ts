import { gqlServerClient } from "../helpers/graphqlClient";
import { StaytionObject } from "../types/staytion";
import { ADD_BRAND, ADD_LISTING, ADD_OUTLET, ADD_RATE } from "./queries";
import { uploadImage } from "./uploadImage";

export const inject = async (data: StaytionObject): Promise<void> => {
  const { brands, outlets, listings, rates } = data;

  await Promise.all(
    brands.map((brand) =>
      gqlServerClient.request(ADD_BRAND, {
        object: brand,
      })
    )
  );

  const uploadedOutletMedia = await Promise.all(
    outlets.map((outlet) =>
      Promise.all(outlet.media.map((media) => uploadImage(media)))
    )
  );

  await Promise.all(
    outlets.map((outlet, index) =>
      gqlServerClient.request(ADD_OUTLET, {
        object: { ...outlet, media: uploadedOutletMedia[index] },
      })
    )
  );

  const uploadedListingMedia = await Promise.all(
    listings.map((listing) =>
      Promise.all(listing.media.map((media) => uploadImage(media)))
    )
  );

  await Promise.all(
    listings.map((listing, index) =>
      gqlServerClient.request(ADD_LISTING, {
        object: { ...listing, media: uploadedListingMedia[index] },
      })
    )
  );

  await Promise.all(
    rates.map((brand) =>
      gqlServerClient.request(ADD_RATE, {
        object: brand,
      })
    )
  );
};
