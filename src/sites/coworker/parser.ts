import { COWORKER_RESOURCES } from "../../constants";
import { CompleteSpace } from "../../types/coworker";
import { Brand, Listing, Outlet, Rate } from "../../types/staytion";
import { groupBy } from "../../utils/group";
import {
  createBrand,
  createListing,
  createOutlet,
  createRate,
} from "../../parser/utils";

export const parseCoworkerData = async (
  cityCode: string,
  brandsWithListings: Record<string, CompleteSpace[]>
) => {
  const brands: Brand[] = [];
  const outlets: Outlet[] = [];
  const listings: Listing[] = [];
  const rates: Rate[] = [];

  const parsedStaytionObj: any[] = [];

  // TODO Revert
  for (const brandName of Object.keys(brandsWithListings)) {
    // for (const brandName of Object.keys(brandsWithListings).filter(
    //   (name) =>
    //     name.toLowerCase().startsWith("common") ||
    //     name.toLowerCase().startsWith("comet")
    // )) {
    const brand = await createBrand(brandName);
    brands.push(brand);

    const brandOutlets: any[] = [];

    for (const space of brandsWithListings[brandName]) {
      const outlet = await createOutlet(brand, space, cityCode);
      outlets.push(outlet);

      const outletListings: any[] = [];

      const hotDeskListings = groupBy(
        space.memberships.hot_desks,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(hotDeskListings)) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.hot_desks,
          parseInt(capacity, 10)
        );
        listings.push(listing);
        const rate = await createRate(
          outlet,
          listing,
          space,
          "hot_desks",
          parseInt(capacity, 10)
        );
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      const dedicatedDeskListings = groupBy(
        space.memberships.dedicated_desks,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(dedicatedDeskListings)) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.dedicated_desks,
          parseInt(capacity, 10)
        );
        listings.push(listing);
        const rate = await createRate(
          outlet,
          listing,
          space,
          "dedicated_desks",
          parseInt(capacity, 10)
        );
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      const privateOfficeListings = groupBy(
        space.memberships.private_offices,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(privateOfficeListings)) {
        const listing = await createListing(
          outlet,
          COWORKER_RESOURCES.private_offices,
          parseInt(capacity, 10)
        );
        listings.push(listing);
        const rate = await createRate(
          outlet,
          listing,
          space,
          "private_offices",
          parseInt(capacity, 10)
        );
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      for (const meetingRoom of space.meetingRooms) {
        const listing = await createListing(
          outlet,
          meetingRoom.name,
          meetingRoom.pax
        );
        listings.push(listing);
        const rate = await createRate(
          outlet,
          listing,
          space,
          "meeting_rooms",
          meetingRoom.pax
        );
        rates.push(rate);

        outletListings.push({ ...listing, rates: [rate] });
      }

      brandOutlets.push({ ...outlet, listings: outletListings });
    }

    parsedStaytionObj.push({ ...brand, outlets: brandOutlets });
  }

  return { brands, outlets, listings, rates };
};
