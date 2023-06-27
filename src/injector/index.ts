import { gqlServerClient } from "../helpers/graphqlClient";
import { StaytionObject } from "../types/staytion";
import { ADD_BRAND, ADD_LISTING, ADD_OUTLET } from "./queries";

export const inject = async (data: StaytionObject): Promise<void> => {
  const { brands, outlets, listings, rates } = data;

  /*
  Promise.all([
    ...brands.map((brand) =>
      gqlServerClient.request(ADD_BRAND, {
        object: brand,
      })
    ),
    ...outlets.map((outlet) =>
      gqlServerClient.request(ADD_OUTLET, {
        object: outlet,
      })
    ),
    ...listings.map((listing) =>
      gqlServerClient.request(ADD_LISTING, {
        object: listing,
      })
    ),
    ...rates.map((brand) =>
      gqlServerClient.request(ADD_BRAND, {
        object: brand,
      })
    ),
  ]);
  */
};
