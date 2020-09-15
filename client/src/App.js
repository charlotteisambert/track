import React, { useState } from "react";
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
  const [zoom, setZoom] = useState(20);
  const [lock, setLock] = useState(false);

  function LockButton() {
    return (
      <div
        onClick={() => setLock(!lock)}
        style={{
          position: "absolute",
          height: "50px",
          width: "50px",
          border: "2px solid black",
          zIndex: 999,
          bottom: 0,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "1rem",
          cursor: "pointer",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
        }}
      >
        <p>Lock</p>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (dataOldMarkers) {
    const currentLocation = getCurrentLocation(dataOldMarkers, dataNewMarker);
    return (
      <>
        <LockButton />
        <Map
          center={lock ? [currentLocation.latitude, currentLocation.longitude] : [48.866667, 2.333333]}
          zoom={zoom}
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
      </>
    );
  }
  return <></>;
}

export default App;
