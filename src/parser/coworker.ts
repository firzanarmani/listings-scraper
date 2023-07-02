/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { COWORKER_RESOURCES } from "../constants";
import { CompleteSpace } from "../types/coworker";
import { Brand, Listing, Outlet, Rate } from "../types/staytion";
import extractBrands from "./extractBrands";
import {
  createBrand,
  createListing,
  createOutlet,
  createRate,
  parseCityCode,
} from "./utils";
import { createBrand, createListing, createOutlet, createRate } from "./utils";

export const parseCoworkerData = async (
  cityCode: string,
  brandsWithListings: Record<string, CompleteSpace[]>
) => {
  const brands: Brand[] = [];
  const outlets: Outlet[] = [];
  const listings: Listing[] = [];
  const rates: Rate[] = [];

  const parsedStaytionObj: any[] = [];

  for (const brandName of Object.keys(brandsWithListings)) {
    const brand = await createBrand(brandName);
    brands.push(brand);

    const brandOutlets: any[] = [];

    for (const space of brandsWithListings[brandName]) {
      const outlet = await createOutlet(brand, space, cityCode);
      outlets.push(outlet);

      const outletListings: any[] = [];

      if (space.list_pricing.hot_desk) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.hot_desk
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "hot_desk");
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      if (space.list_pricing.dedicated_desk) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.dedicated_desk
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "dedicated_desk");
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      if (space.list_pricing.private_office) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.private_office
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "private_office");
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      if (space.list_pricing.meeting_room) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.meeting_room
        );
        listings.push(listing);
        const rate = await createRate(outlet, listing, space, "meeting_room");
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      brandOutlets.push({ ...outlet, listings: outletListings });
    }

    parsedStaytionObj.push({ ...brand, outlets: brandOutlets });
  }

  return { brands, outlets, listings, rates };
};
