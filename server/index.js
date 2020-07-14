const { ApolloServer, gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";

let currentLocation = {
  longitude: 126.981834,
  latitude: 37.556398,
};

const INCREASE = 0.0001;

async function createMarker(marker) {
  const db = await MongoClient.connect(url);
  var dbo = db.db("track");
  marker._id = null;
  const Locations = dbo.collection("locations");
  const result = await Locations.insertOne(marker);
  db.close();
  const createdMarker = result.ops[0];
  pubsub.publish("MARKER_ADDED", { markerAdded: createdMarker });
  return createdMarker;
}

// UnhandledPromiseRejectionWarning: MongoError: E11000 duplicate key error collection: track.locations index: _id_ dup key: { _id: ObjectId('5f0db4ec403a6f1fc54008f0') }

setInterval(() => {
  currentLocation.longitude += INCREASE;
  currentLocation.latitude += INCREASE;
  createMarker(currentLocation);
}, 1000);

const typeDefs = gql`
  type Marker {
    _id: ID!
    longitude: Float!
    latitude: Float!
  }
  type Query {
    getMarkers: [Marker]
    getMarker(_id: ID!): Marker
  }
  type Mutation {
    createMarker(latitude: Float!, longitude: Float!): Marker
  }
  type Subscription {
    markerAdded: Marker
  }
`;

const prepare = (o) => {
  o._id = o._id.toString();
  return o;
};

const resolvers = {
  Query: {
    getMarkers: async () => {
      const db = await MongoClient.connect(url);
      var dbo = db.db("track");
      const Locations = dbo.collection("locations");
      return await Locations.find({}).toArray();
    },
    getMarker: async (_, { _id }) => {
      const db = await MongoClient.connect(url);
      var dbo = db.db("track");
      const Locations = dbo.collection("locations");
      return prepare(await Locations.findOne(ObjectId(_id)));
    },
  },
  Mutation: {
    createMarker: async (_, marker) => {
      return createMarker(marker);
    },
  },
  Subscription: {
    markerAdded: {
      subscribe: () => pubsub.asyncIterator("MARKER_ADDED"),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/subscription",
  },
});
const options = {};
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
