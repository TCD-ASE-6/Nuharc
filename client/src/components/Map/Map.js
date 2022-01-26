import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

const API_KEY = "AIzaSyAK7fU7K5MEJieLeb91s-1ujV87tcUp6VY";

function get_str(loc) {
  return `${loc.lat},${loc.lng}`;
}

function checkDisasterInRoute(route, disasterLocation) {}

function Map() {
  const [currentCoordinates, setCurrentCoordinates] = useState(0);
  const [destinationCoordinates, setDestinationCoordinates] = useState(0);
  const [allRoutes, setAllRoutes] = useState(0);
  const [currentRoute, setCurrentRoute] = useState(0);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [countOfRoutes, setCountOfRoutes] = useState(0);
  const [zoom, setZoom] = useState(15);

  // Getting the current location
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  navigator.geolocation.getCurrentPosition(
    function (position) {
      setCurrentCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setDestinationCoordinates({
        lat: 53.35460864423722,
        lng: -6.256456570972608,
      });
    },
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    options
  );

  async function getRoutes(from, to) {
    let data = "";
    try {
      data = await fetch(
        `http://localhost:8080/api/directions/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    data = await data.text().then((data) => JSON.parse(data));
    setAllRoutes(data);
    setCountOfRoutes(data.length);
    setCurrentRouteIndex(0);
  }

  return (
    <div style={{ height: "93.5vh", width: "100%" }}>
      <button
        onClick={() =>
          getRoutes(
            get_str(currentCoordinates),
            get_str(destinationCoordinates)
          )
        }
      >
        Get Routes
      </button>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        center={currentCoordinates}
        defaultZoom={zoom}
      >
        {/* Placing the marker at the current location */}
        <Marker
          lat={currentCoordinates.lat}
          lng={currentCoordinates.lng}
          name="Current Location"
          color="blue"
        ></Marker>
      </GoogleMapReact>
    </div>
  );
}

export default Map;
