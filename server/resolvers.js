const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const Markers = require('./mongoose');

async function createMarker(marker) {
  const newMarker = new Markers({
    longitude: marker.longitude,
    latitude: marker.latitude,
  });
  const createdMarker = await newMarker.save();
  pubsub.publish("MARKER_ADDED", { markerAdded: createdMarker });
  return createdMarker;
}

const resolvers = {
  Query: {
    getMarkers: async () => {
      return await Markers.find();
    },
    getMarker: async (_, { _id }) => {
      return await Markers.findById(_id);
    },
  },
  Mutation: {
    createMarker: async (_, marker) => {
      return await createMarker(marker);
    },
  },
  Subscription: {
    markerAdded: {
      subscribe: () => pubsub.asyncIterator("MARKER_ADDED"),
    },
  },
};

module.exports = { createMarker, resolvers };