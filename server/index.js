const { ApolloServer, gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";

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

const db = await MongoClient.connect(url);
var dbo = db.db("track");

const resolvers = {
  Query: {
    getMarkers: async () => {
      const Locations = dbo.collection("locations");
      return await Locations.find({}).toArray();
    },
    getMarker: async (_, { _id }) => {
      const Locations = dbo.collection("locations");
      return prepare(await Locations.findOne(ObjectId(_id)));
    },
  },
  Mutation: {
    createMarker: async (_, marker) => {
      const Locations = dbo.collection("locations");
      const res = await Locations.insertOne(marker);
      console.log(res);
      pubsub.publish("MARKER_ADDED", { markerAdded: res.ops[0] });
      return res.ops[0];
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
