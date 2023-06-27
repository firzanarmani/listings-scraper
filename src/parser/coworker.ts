/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { AVOID_BRAND_NAMES, COWORKER_RESOURCES } from "../constants";
import { Space } from "../types/coworker";
import { Brand, Listing, Outlet, Rate } from "../types/staytion";
import extractBrands from "./extractBrands";
import {
  createBrand,
  createListing,
  createOutlet,
  createRate,
  parseCityCode,
} from "./utils";

export const parseCoworkerData = async (
  cityCode: string,
  rawListings: any[]
) => {
  const { city } = parseCityCode(cityCode);

  const filteredListings = (rawListings as Space[])
    .filter((space) => space.location.city_name.toLowerCase() === city)
    .filter((space) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const brand of AVOID_BRAND_NAMES) {
        if (space.name.toLowerCase().startsWith(brand.toLowerCase()))
          return false;
      }
      return true;
    });

  const brandsWithListings = extractBrands(filteredListings);

  const brands: Brand[] = [];
  const outlets: Outlet[] = [];
  const listings: Listing[] = [];
  const rates: Rate[] = [];

  for (const brandName of Object.keys(brandsWithListings)) {
    const brand = await createBrand(brandName);
    brands.push(brand);

    for (const space of brandsWithListings[brandName]) {
      const outlet = await createOutlet(brand, space, cityCode);
      outlets.push(outlet);

      if (space.list_pricing.hot_desk) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.hot_desk
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "hot_desk");
        rates.push(rate);
      }

      if (space.list_pricing.dedicated_desk) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.dedicated_desk
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "dedicated_desk");
        rates.push(rate);
      }

      if (space.list_pricing.private_office) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.private_office
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "private_office");
        rates.push(rate);
      }

      if (space.list_pricing.meeting_room) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.meeting_room
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "meeting_room");
        rates.push(rate);
      }
    }
  }

  return { brands, outlets, listings, rates };
};
