import { gql } from "graphql-request";

export const ADD_BRAND = gql`
  mutation AddBrand($object: brands_insert_input!) {
    insert_brands_one(object: $object) {
      id
      __typename
    }
  }
`;

export const ADD_OUTLET = gql`
  mutation AddOutlet($object: outlets_insert_input!) {
    insert_outlets_one(object: $object) {
      id
      __typename
    }
  }
`;

export const ADD_LISTING = gql`
  mutation AddListing($object: listings_insert_input!) {
    insert_listings_one(object: $object) {
      id
      __typename
      updated_at
      outlet_id
      outlet {
        brand_id
        brand {
          name
        }
      }
    }
  }
`;

export const ADD_RATE = gql`
  mutation AddRate($object: rates_insert_input!) {
    insert_rates_one(object: $object) {
      id
      __typename
    }
  }
`;
