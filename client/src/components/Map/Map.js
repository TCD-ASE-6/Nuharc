import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import axios from "axios";
import IncidentMarker from "./IncidentMarker";
import AutoComplete from "./AutoComplete";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const API_KEY = "AIzaSyAMx4aEZjPHMjCnlyeqB5-K9tNKs2k4Dcs";
/* global google */

class Map extends React.Component {
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
      incidents: { incidentList: [] },
      address: "",
      polyline: null,
    };
    this.setCurrentPostion();
    this.setIncidents();
  }

  clearPolyLineAndCurentRoute() {
    this.setState({ currentRoute: null });
    try {
      this.state.polyline.setMap(null);
    } catch {}
  }

  setAddressAndDestinationCoordinates(data) {
    this.setState({
      address: data.address,
      destinationCoordinates: data.destinationCoordinates,
    });
    this.clearPolyLineAndCurentRoute();
  }

  setPolyline() {
    const maps = this.state.maps;
    let polyline = new maps.Polyline({
      path: this.getPolyLineFromRoute(this.state.currentRoute),
      geodesic: true,
      strokeColor: "#00a1e1",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    this.setState({ polyline: polyline });
    this.state.polyline.setMap(this.state.map);
  }

  async getRoutes(from, to) {
    console.log(from);
    console.log(to);
    let data = "";
    try {
      data = await fetch(
        `http://localhost:8080/api/directions/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    data = JSON.parse(await data.text());
    console.log(data);
    const currentRoute = data[0];
    this.setState({ currentRoute: currentRoute });
    this.setPolyline();
  }

  async setIncidents() {
    const incidents = await axios.get("/api/incident/");
    this.setState({ incidents: { incidentList: incidents.data } });
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
          },
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }

  setMapState(map, maps) {
    this.setState({ maps, map });
  }

  setAddress(address) {
    this.setState({ address: address });
  }

  render() {
    return (
      <div style={{ height: "93.5vh", width: "100%" }}>
        <AutoComplete
          setAddressAndDestinationCoordinates={this.setAddressAndDestinationCoordinates.bind(
            this
          )}
        />
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
          onGoogleApiLoaded={({ map, maps }) => this.setMapState(map, maps)}
        >
          <Marker
            lat={this.state.currentCoordinates.lat}
            lng={this.state.currentCoordinates.lng}
            name="Current Location"
            color="blue"
          ></Marker>

          {this.state.destinationCoordinates && (
            <Marker
              lat={this.state.destinationCoordinates.lat}
              lng={this.state.destinationCoordinates.lng}
              name="Destination Location"
              color="red"
            ></Marker>
          )}
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

export default Map;
