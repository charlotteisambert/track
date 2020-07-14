const { ApolloServer, gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";
const seoulLocation = {
  longitude: 126.981834,
  latitude: 37.556398,
};

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
      const db = await MongoClient.connect(url);
      var dbo = db.db("track");
      const Locations = dbo.collection("locations");
      const res = await Locations.insertOne(marker);
      console.log(res)
      pubsub.publish("MARKER_ADDED", { markerAdded: res.ops[0] });
      return res.ops[0]
    },
  },
  Subscription: {
    markerAdded: {
      subscribe: () => pubsub.asyncIterator("MARKER_ADDED"),
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
