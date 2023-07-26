import { gql } from "graphql-request";

export const INJECT_BRAND = gql`
  mutation InjectBrand($object: brands_insert_input!) {
    insert_brands_one(object: $object) {
      id
      __typename
    }
  }
`;
