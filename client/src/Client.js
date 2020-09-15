
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
  // uri: 'http://floriansahbi.com/graphql'
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/subscription",
  // uri: "ws://floriansahbi.com/subscription",
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default client;
