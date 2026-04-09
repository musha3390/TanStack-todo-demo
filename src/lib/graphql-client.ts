import { graphql } from "graphql";
import { GraphQLClient } from "graphql-request";
import { headers } from "next/headers";

const endpoint = "http://localhost:3000/api/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
    headers: {}
});