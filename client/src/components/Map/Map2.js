import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import axios from 'axios';
import IncidentMarker from "./IncidentMarker";

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

  checkDisasterInRoute(route, disasterLocation) {
    console.log('route checking is working');
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
      },
      incidents: { incidentList: [] }
    }
    this.setCurrentPostion();
    this.setIncidents();
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
    data = JSON.parse(await data.text())
    const currentRoute = data[0];
    const maps = this.state.maps
    let polyline = new maps.Polyline({
      path: this.getPolyLineFromRoute(currentRoute),
      geodesic: true,
      strokeColor: "#00a1e1",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    polyline.setMap(this.state.map);
  }

  async setIncidents() {
    const incidents = await axios.get('/api/incident/')
    this.setState({ incidents: { incidentList: incidents.data } })
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
        this.setState({
          currentCoordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        })
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }

  setMapState(map, maps) {
    this.setState({ maps, map })
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
        <button
          onClick={() =>
            this.checkDisasterInRoute()
          }
        >
          Check Disaster In Route
        </button>
        <GoogleMapReact
          center={this.state.currentCoordinates}
          defaultZoom={15}
          bootstrapURLKeys={{ key: API_KEY,
            libraries:['places', 'geometry', 'drawing', 'visualization']
          }}
          center={this.state.currentCoordinates}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.setMapState(map, maps)}
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
          {this.state.incidents.incidentList.map((incident, i) => (
            <IncidentMarker
              key={i}
              lng={incident.longitude.$numberDecimal}
              lat={incident.latitude.$numberDecimal}
              date={incident.date}
              incidentType={incident.incidentType}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map2;