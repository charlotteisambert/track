const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers").resolvers;
const createMarker = require("./resolvers").createMarker;

let currentLocation = {
  longitude: 126.981834,
  latitude: 37.556398,
};

const INCREASE_RATE = 0.0001;

setInterval(async () => {
  currentLocation.longitude += INCREASE_RATE;
  currentLocation.latitude += INCREASE_RATE;
  try {
    await createMarker(currentLocation);
  }
  catch (error) {
    console.log(error);
  }
}, 1000);

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
