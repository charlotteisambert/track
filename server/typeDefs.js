const { gql } = require("apollo-server");

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
}`;

module.exports = typeDefs;