import React from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';
import { Map, Marker, TileLayer } from "react-leaflet";

const GET_MARKERS = gql`
  query GetMarkers {
    getMarkers {
      _id
      latitude
      longitude
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_MARKERS);

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (data) {
    console.log(data.getMarkers[0])
    return (
      <>
        <div className="App">
          {data.getMarkers.map(({ latitude, longitude }) => <div>{latitude} - {longitude}</div>)}
        </div>
        {/* Latitude, Longitude */}
        <Map center={[37.556398, 126.981834]} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            key={data.getMarkers[0]._id}
            position={[
              data.getMarkers[0].latitude,
              data.getMarkers[0].longitude
            ]}
            onClick={() => {
              console.log(data.getMarkers[0])
            }}
          />
        </Map>
      </>
    );
  }
}

export default App;
