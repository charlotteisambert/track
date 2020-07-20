let MongoClient = require("mongodb").MongoClient;
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
let ObjectId = require("mongodb").ObjectId;
const URL = "mongodb://localhost:27017";

const prepare = (o) => {
    o._id = o._id.toString();
    return o;
};

async function createMarker(marker) {
    const db = await MongoClient.connect(URL);
    var dbo = db.db("track");
    marker._id = null;
    const Locations = dbo.collection("locations");
    const result = await Locations.insertOne(marker);
    db.close();
    const createdMarker = result.ops[0];
    pubsub.publish("MARKER_ADDED", { markerAdded: createdMarker });
    return createdMarker;
}

const resolvers = {
    Query: {
        getMarkers: async () => {
            const db = await MongoClient.connect(URL);
            const dbo = db.db("track");
            const Locations = dbo.collection("locations");
            return await Locations.find({}).toArray();
        },
        getMarker: async (_, { _id }) => {
            const db = await MongoClient.connect(URL);
            const dbo = db.db("track");
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

module.exports = { createMarker, resolvers };