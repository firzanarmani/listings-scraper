import { COWORKER_RESOURCES } from "../../constants";
import { CompleteSpace } from "./types";
import { Listing, Outlet, StaytionObject } from "../../types/staytion";
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
  const parsedStaytionObj: StaytionObject = [];

  // TODO Revert
  for (const brandName of Object.keys(brandsWithListings)) {
    // for (const brandName of Object.keys(brandsWithListings).filter(
    //   (name) =>
    //     name.toLowerCase().startsWith("common") ||
    //     name.toLowerCase().startsWith("comet")
    // )) {
    const brandOutlets: Outlet[] = [];

    for (const space of brandsWithListings[brandName]) {
      const outletListings: Listing[] = [];

      const hotDeskListings = groupBy(
        space.memberships.hot_desks,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(hotDeskListings)) {
        const rate = await createRate(
          space,
          "hot_desks",
          parseInt(capacity, 10)
        );
        const listing = await createListing(
          space,
          [rate],
          COWORKER_RESOURCES.hot_desks,
          parseInt(capacity, 10)
        );

        outletListings.push(listing);
      }

      const dedicatedDeskListings = groupBy(
        space.memberships.dedicated_desks,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(dedicatedDeskListings)) {
        const rate = await createRate(
          space,
          "dedicated_desks",
          parseInt(capacity, 10)
        );
        const listing = await createListing(
          space,
          [rate],
          COWORKER_RESOURCES.dedicated_desks,
          parseInt(capacity, 10)
        );

        outletListings.push(listing);
      }

      const privateOfficeListings = groupBy(
        space.memberships.private_offices,
        (desk) => desk.capacity
      );
      for (const capacity of Object.keys(privateOfficeListings)) {
        const rate = await createRate(
          space,
          "private_offices",
          parseInt(capacity, 10)
        );
        const listing = await createListing(
          space,
          [rate],
          COWORKER_RESOURCES.private_offices,
          parseInt(capacity, 10)
        );

        outletListings.push(listing);
      }

      for (const meetingRoom of space.meetingRooms) {
        const rate = await createRate(space, "meeting_rooms", meetingRoom.pax);
        const listing = await createListing(
          space,
          [rate],
          meetingRoom.name,
          meetingRoom.pax
        );

        outletListings.push(listing);
      }

      const outlet = await createOutlet(
        brandName,
        outletListings,
          space,
        cityCode
        );

      brandOutlets.push(outlet);
      }

    // Modify rates to override outlet_id
    const updatedOutlets = brandOutlets.map((outlet) => ({
      ...outlet,
      listings: {
        data: outlet.listings.data.map((listing) => ({
          ...listing,
          rates: {
            data: listing.rates.data.map((rate) => ({
              ...rate,
              outlet_id: outlet.id,
            })),
          },
        })),
      },
    }));

    const brand = await createBrand(brandName, updatedOutlets);

    parsedStaytionObj.push(brand);
  }

  return parsedStaytionObj;
};
