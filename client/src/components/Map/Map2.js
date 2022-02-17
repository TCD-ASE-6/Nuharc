import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import IncidentMarkerList from "./IncidentMarkerList";

const API_KEY = "AIzaSyAK7fU7K5MEJieLeb91s-1ujV87tcUp6VY";
/* global google */

class Map2 extends React.Component {

  get_str(loc) {
    return `${loc.lat},${loc.lng}`;
  }

  getPolyLineFromRoute(route) {
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

  constructor(props) {
    super(props);
    this.state = {
      currentCoordinates: {
        lat: 53.36460864423722,
        lng: -6.256456570972608,
      },
      destinationCoordinates: {
        lat: 53.35600864423722,
        lng: -6.256456570972608
      } 
    }
    this.setCurrentPostion();
  }

  async getRoutes(from, to) {
    let data = "";
    try {
      data = await fetch(
        `http://localhost:8080/api/directions/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    data = await JSON.parse(data.text())
    // let polyline = new maps.Polyline({
    //   path: getPolyLineFromRoute(currentRoute),
    //   geodesic: true,
    //   strokeColor: "#00a1e1",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 4,
    // });
  }

  setCurrentPostion() {
     // Getting the current location
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.watchPosition(
      (position) => {
        this.setState({currentCoordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }})
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }

  render() {
    return (
      <div style={{ height: "93.5vh", width: "100%" }}>
        <button
          onClick={() =>
            this.getRoutes(
              this.get_str(this.state.currentCoordinates),
              this.get_str(this.state.destinationCoordinates)
            )
          }
        >
          Get Routes
        </button>
        <GoogleMapReact
          center={this.state.currentCoordinates}
          defaultZoom={15}
          bootstrapURLKeys={{ key: API_KEY }}
          center={this.state.currentCoordinates}
          yesIWantToUseGoogleMapApiInternals
        >
          <Marker
            lat={this.state.currentCoordinates.lat}
            lng={this.state.currentCoordinates.lng}
            name="Current Location"
            color="blue"
          ></Marker>
          <Marker
            lat={this.state.destinationCoordinates.lat}
            lng={this.state.destinationCoordinates.lng}
            name="Destination Location"
            color="red"
          ></Marker>
          <IncidentMarkerList>
          </IncidentMarkerList>
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map2;