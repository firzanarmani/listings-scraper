// import { gql } from "graphql-request";
import { customAlphabet } from "nanoid";
import { numbers } from "nanoid-dictionary";
import slugify from "slugify";
// import { gqlServerClient } from "../helpers/graphqlClient";

const randomNumbers = customAlphabet(numbers, 5);

export const slugStringDB = async (
  value: string,
  _table: string,
  _id?: string | null
) => {
  const slugifiedValue = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

  // TODO Remove on release
  // if (id) {
  //   const currentSlugResults = await gqlServerClient.request(
  //     gql`
  //       query GetSlug($id: uuid!) {
  //         ${table}_by_pk(id: $id) {
  //           slug
  //         }
  //       }
  //     `,
  //     {
  //       id,
  //     }
  //   );

  //   const currentSlug = currentSlugResults?.[`${table}_by_pk`]?.slug;

  //   if (currentSlug) {
  //     const currentSlugSplit = currentSlug.split("-");
  //     currentSlugSplit.pop();
  //     const currentSlugWithoutRandomNumbers = currentSlugSplit.join("-");
  //     if (currentSlugWithoutRandomNumbers === slugifiedValue) {
  //       return currentSlug;
  //     }
  //   }
  // }

  return `${slugifiedValue}-${randomNumbers()}`;
};
