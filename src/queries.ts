import { gql } from "graphql-request";

export const GET_BRAND = gql`
  query GetBrand($brandName: String) {
    brands(where: { name: { _eq: $brandName } }) {
      id
    }
  }
`;

export const INJECT_BRAND = gql`
  mutation InjectBrand($object: brands_insert_input!) {
    insert_brands_one(object: $object) {
      id
    }
  }
`;

export const INJECT_OUTLETS = gql`
  mutation InjectOutlets($objects: [outlets_insert_input!]!) {
    insert_outlets(objects: $objects) {
      returning {
        id
      }
    }
  }
`;
