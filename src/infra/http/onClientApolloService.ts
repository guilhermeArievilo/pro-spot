import { ApolloClient, InMemoryCache } from '@apollo/client';

const config = {
  uri: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
  },
  cache: new InMemoryCache()
};

export const GraphQlClient = new ApolloClient(config);
