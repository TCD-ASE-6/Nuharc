import React from "react";
import GoogleMapReact from "google-map-react";
import API_URL from "../../environment";
import Marker from "./Marker";
import axios from "axios";
import IncidentMarker from "./IncidentMarker";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// import DisasterRouteService from "../../services/disaster-route.service";

const API_KEY = "AIzaSyAMx4aEZjPHMjCnlyeqB5-K9tNKs2k4Dcs";
const DEFAULT_ZOOM = 15;
/* global google */

class Map2 extends React.Component {
  get_str(loc) {
    return `${loc.lat},${loc.lng}`;
  }

  getPolyLineFromRoute(route) {
    let path = [];
    if (route) {
      path = route.map((coordinate, idx) => {
        return {
          lat: coordinate[0],
          lng: coordinate[1],
        };
      });
      return path;
    }
  }

  constructor(props) {
    super(props);
    const currentCoordinates = {
      lat: 53.36460864423722,
      lng: -6.256456570972608,
    };
    this.state = {
      currentCoordinates,
      incidents: { incidentList: [] },
      address: "",
      center: currentCoordinates,
      zoom: DEFAULT_ZOOM,
    };
    this.setCurrentPostion();
    this.setIncidents();
  }

  async handleSelect(value) {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    this.setState({ address: value });
    this.setState({ destinationCoordinates: latLng });
    this.setState({ currentRoute: null });
    this.reConfigureZoom();
    this.resetPolyLine();
  }

  /**
   * Reconfigures zoom and center based on current coordinates and destinatation coordinates
   */

  reConfigureZoom() {
    if (this.state.destinationCoordinates) {
      const map = this.state.map;
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(this.state.currentCoordinates);
      bounds.extend(this.state.destinationCoordinates);
      map.fitBounds(bounds);
    }
  }

  /**
   * Resetting existing PolyLine for map
   */
  resetPolyLine() {
    const currentPolyLine = this.state.polyline;
    if (currentPolyLine) {
      currentPolyLine.setMap(null);
      this.setState({ polyline: null });
    }
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
    polyline.setMap(this.state.map);
    this.setState({ polyline });
  }

  async getRoutes(from, to) {
    // const routeService = new DisasterRouteService();
    // // TODO Move this updwards and access incident list from the service only
    // await routeService.configureIncidentList();
    // const currentRoute = await routeService.getRoute(from, to)
    // this.setState({ currentRoute: currentRoute });
    // this.setPolyline();
  }

  async setIncidents() {
    const incidents = await axios.get(`${API_URL}/api/incident/`);
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
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.setState({
          currentCoordinates: {
            lat,
            lng,
          },
          center: { lat, lng },
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
    this.setState({ address });
  }

  render() {
    return (
      <div style={{ height: "93.5vh", width: "100%" }}>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.setAddress.bind(this)}
          onSelect={this.handleSelect.bind(this)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input",
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
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
          )}
        </PlacesAutocomplete>
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
          center={this.state.center}
          defaultZoom={DEFAULT_ZOOM}
          zoom={this.state.zoom}
          bootstrapURLKeys={{ key: API_KEY }}
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

export default Map2;
