const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers").resolvers;
// require("./intervalMarkers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/subscription",
  },
});
server.listen().then(({ URL }) => {
  console.log(`🚀  Server ready at ${URL}`);
});
