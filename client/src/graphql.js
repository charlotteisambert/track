import { gql } from "@apollo/client";

export const MARKER_ADDED = gql`
  subscription MarkerAdded {
    markerAdded {
      _id
      latitude
      longitude
    }
  }
`;

export const GET_MARKERS = gql`
  query GetMarkers {
    getMarkers {
      _id
      latitude
      longitude
    }
  }
`;
