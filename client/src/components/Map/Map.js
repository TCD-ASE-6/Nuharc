// import React, { Component, useEffect, useState } from "react";
import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
// import {
//   withGoogleMap,
//   withScriptjs,
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
// } from "react-google-maps";

const API_KEY = "AIzaSyAK7fU7K5MEJieLeb91s-1ujV87tcUp6VY";

function get_str(loc) {
  return `${loc.lat},${loc.lng}`;
}

function getPolyLineFromRoute(route) {
  var path = [];
  console.log(route);
  route.map((coordinate, idx) => {
    path.push({
      lat: coordinate[0],
      lng: coordinate[1],
    });
  });
  return path;
}

function Map() {
  const [currentCoordinates, setCurrentCoordinates] = useState(0);
  const [destinationCoordinates, setDestinationCoordinates] = useState(0);
  const [allRoutes, setAllRoutes] = useState(0);
  const [currentRoute, setCurrentRoute] = useState(0);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [countOfRoutes, setCountOfRoutes] = useState(0);
  const [zoom, setZoom] = useState(15);
  const [showDirections, setShowDirections] = useState(false);
  const [getRoutesClicked, setGetRoutesCliked] = useState(false);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  // Getting the current location
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  navigator.geolocation.watchPosition(
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

  function checkDisasterInRoute(route, disasterLocation) {}

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
    setCurrentRoute(data[currentRouteIndex]);

    let polyline = new maps.Polyline({
      path: getPolyLineFromRoute(currentRoute),
      geodesic: true,
      strokeColor: "#00a1e1",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    polyline.setMap(map);
  }

  function setMapState(map, maps) {
    setMap(map);
    setMaps(maps);
  }

  const handleSelect = async value => {
    const results = geocodeByAddress(value);
    const latlng = getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latlng);
  };

  return (
    <div style={{ height: "93.5vh", width: "100%" }}>
      <div>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}</PlacesAutocomplete>
      </div>
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
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => setMapState(map, maps)}
      >
        <Marker
          lat={currentCoordinates.lat}
          lng={currentCoordinates.lng}
          name="Current Location"
          color="blue"
        ></Marker>
        <Marker
          lat={destinationCoordinates.lat}
          lng={destinationCoordinates.lng}
          name="Destination Location"
          color="red"
        ></Marker>
      </GoogleMapReact>
    </div>
  );
}

export default Map;
