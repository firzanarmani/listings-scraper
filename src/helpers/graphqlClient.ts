import { GraphQLClient } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const hasuraEndPoint = process.env.HASURA_ENDPOINT_URL || "";

const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET || "";

export const gqlServerClient = new GraphQLClient(hasuraEndPoint, {
  headers: {
    "x-hasura-admin-secret": hasuraAdminSecret,
    "content-type": "application/json",
  },
});
