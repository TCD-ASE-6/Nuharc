import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import keys from "../../../../config/keys";

function Map() {
  const [currentCoordinates, setCurrentCoordinates] = useState(0);
  const [destinationCoordinates, setDestinationCoordinates] = useState(0);
  const [allRoutes, setAllRoutes] = useState(0);
  const [currentRoute, setCurrentRoute] = useState(0);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [countOfRoutes, setCountOfRoutes] = useState(0);
  const [zoom, setZoom] = useState(15);

  // Getting the current location
  navigator.geolocation.getCurrentPosition(function (position) {
    // setting current location into the state
    setCurrentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });

    setDestinationCoordinates({
      lat: 53.3458095,
      lng: -6.2543664,
    });
  });

  getRoutes = async (from, to) => {
    let data = "";
    try {
      data = await fetch(
        `http://localhost:8080/api/directions/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    data = await data.text().then((data) => JSON.parse(data));
    if (data.status === "OK" && data.routes.length) {
      setAllRoutes(data);
      setCountOfRoutes(data.length);
      setCurrentRouteIndex(0);
    }
  };

  return (
    <div style={{ height: "93.5vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: keys.googleMapsAPIKey }}
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
