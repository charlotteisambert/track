const { ApolloServer, gql } = require("apollo-server");
let MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const typeDefs = gql`
  type Marker {
    longitude: Float!
    latitude: Float!
  }
  type Query {
    getMarkers: [Marker]!
    getMarker: Marker!
  }
  type Mutation {
    createMarker(latitude: Float!, longitude: Float!): Marker
    # createMarkers([latitude: Float, longitude: Float]): [Marker]
  }
`;

const marker = {
  longitude: 13.2,
  latitude: 12,
};

const markers = [marker];

const resolvers = {
  Query: {
    getMarkers: () => {
      return markers;
    },
    getMarker: () => {
      return marker;
    },
  },
  Mutation: {
    // createMarkers: (parent, { latitude, longitude }, context, info) => {
    //   return markers;
    // },
    createMarker: (parent, { latitude, longitude }, context, info) => {
      MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("track");
        let myobj = { latitude, longitude };
        dbo.collection("locations").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
      return { latitude, longitude };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
