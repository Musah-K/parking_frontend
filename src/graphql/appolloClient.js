import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://parkingbackend-production-dff7.up.railway.app/graphql',
    // uri: 'http://localhost:3001/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;
