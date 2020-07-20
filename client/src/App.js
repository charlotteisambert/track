import React from "react";
import "./App.css";
import { useQuery, useSubscription } from "@apollo/client";
import { Map, Marker, TileLayer } from "react-leaflet";
import { MARKER_ADDED, GET_MARKERS } from "./graphql";

function getCurrentLocation(dataOldMarkers, dataNewMarkers) {
  if (dataNewMarkers) {
    return dataNewMarkers.markerAdded;
  } else {
    return dataOldMarkers.getMarkers[0]; //returns the last marker
  }
}

function App() {
  const { loading, error, data: dataOldMarkers } = useQuery(GET_MARKERS);
  const { data: dataNewMarker } = useSubscription(MARKER_ADDED);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (dataOldMarkers) {
    const currentLocation = getCurrentLocation(dataOldMarkers, dataNewMarker);
    return (
      <Map
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={20}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          key={currentLocation._id}
          position={[currentLocation.latitude, currentLocation.longitude]}
        />
      </Map>
    );
  }
  return <></>;
}

export default App;
