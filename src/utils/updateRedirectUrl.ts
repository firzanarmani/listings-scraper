// Note: This is one-off script to replace redirect_urls of listings that have a specific redirect_provider

import { gql } from "graphql-request";
import { gqlServerClient } from "../helpers/graphqlClient";

const GET_LISTING_REDIRECT_URLS = gql`
  query GetListingRedirectUrls($provider: String) {
    listings(where: { redirect_provider: { _eq: $provider } }) {
      id
      redirect_url
    }
  }
`;

const UPDATE_LISTINGS_URL = gql`
  mutation UpdateListings($id: uuid!, $redirect_url: String) {
    update_listings_by_pk(
      pk_columns: { id: $id }
      _set: { redirect_url: $redirect_url }
    ) {
      id
    }
  }
`;

export const updateRedirectUrl = async (refId: string) => {
  const results = await gqlServerClient.request<
    {
      listings: {
        id: string;
        redirect_url: string;
      }[];
    },
    { provider: string }
  >(GET_LISTING_REDIRECT_URLS, { provider: "Filmplace" });

  const updatedListings = results.listings.map((listing) => {
    const updatedUrl = new URL(listing.redirect_url);

    updatedUrl.searchParams.set("ref", refId);

    return { id: listing.id, url: updatedUrl.toString() };
  });

  await Promise.all(
    updatedListings.map((listing) =>
      gqlServerClient.request<
        { update_listings_by_pk: { id: string } },
        { id: string; redirect_url: string }
      >(UPDATE_LISTINGS_URL, { id: listing.id, redirect_url: listing.url })
    )
  );
};
