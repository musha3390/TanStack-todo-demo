import { graphql } from "graphql";
import { GraphQLClient } from "graphql-request";

const endpoint = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/graphql`;

export const graphqlClient = new GraphQLClient(endpoint, {
    headers: {}
});