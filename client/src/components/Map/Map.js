import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

function Map() {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [zoom, setZoom] = useState(15);

  // Getting the current location
  navigator.geolocation.getCurrentPosition(function (position) {
    // setting current location into the state
    setCurrentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  });

  return (
    <div style={{ height: "93.5vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAK7fU7K5MEJieLeb91s-1ujV87tcUp6VY" }}
        center={currentLocation}
        defaultZoom={zoom}
      >
        {/* Placing the marker at the current location */}
        <Marker
          lat={currentLocation.lat}
          lng={currentLocation.lng}
          name="Current Location"
          color="blue"
        ></Marker>
      </GoogleMapReact>
    </div>
  );
}

export default Map;
