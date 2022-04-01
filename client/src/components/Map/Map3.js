import React from "react";
import axios from "axios";
import "./IncidentMarker.css";

import { Button, ListGroup, ListGroupItem } from "reactstrap";

// require('dotenv').config();

// HERE API key
const API_KEY = "Z9irXJBDz_jDcLwmi-1WwTBdSTQmBci1wB9QqTzwZMY";
// Initial latitude to center the map on Dublin
const DUBLIN_LAT = 53.34460864423722;
// Initial longitude to center the map on Dublin
const DUBLIN_LNG = -6.276456570972608;
// Initial zoom factor of the map
const INITIAL_ZOOM = 13;
// Transport mode for the HERE map API
const TRANSPORT_MODE = "pedestrian";
// Routing mode for the HERE map API
const ROUTING_MODE = "fast";
// Routing mode for the HERE map API
const AUTOCOMPLETE_COUNTRY_CODE = "IRL";
// Max retrieved results for autocompletion
const AUTOCOMPLETE_MAX_RESULTS = 5;
// Element Id of the search suggestions
const SEARCH_SUGGESTIONS_ID = "searchSuggestionsId";
// Element Id of the search suggestions
const SEARCH_BAR_ID = "searchBarId";
// Element Id of the destination span
const DESTINATION_SPAN_ID = "destinationSpanId";

export default class Map3 extends React.Component {
  mapRef = React.createRef();
  autocompleteRequest = new XMLHttpRequest();
  //HERE maps instance
  H = window.H;

  /**
   * ctor
   *
   */
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      currentCoordinates: {
        lat: DUBLIN_LAT,
        lng: DUBLIN_LNG,
      },
      destinationCoordinates: {
        lat: 53.35600864423722,
        lng: -6.256456570972608,
      },
      incidents: { incidentList: [] },
      address: "",
      router: null,
      isFixedRoute: false,
      incidentAtDestination: {},
    };
    //bind callbacks
    this.onRoutingResult = this.onRoutingResult.bind(this);
    this.onSearchBarKeyUp = this.onSearchBarKeyUp.bind(this);
    this.onAutoCompleteSuccess = this.onAutoCompleteSuccess.bind(this);
    this.setCurrentPostion();
    this.setIncidents();
  }

  /**
   * componentDidMount hook
   *
   */
  componentDidMount() {
    const platform = new this.H.service.Platform({
      apikey: API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new this.H.Map(
      this.mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: DUBLIN_LAT, lng: DUBLIN_LNG },
        zoom: INITIAL_ZOOM,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    const behavior = new this.H.mapevents.Behavior(
      new this.H.mapevents.MapEvents(map)
    );

    // Create the default UI components to allow the user to interact with them
    const ui = this.H.ui.UI.createDefault(map, defaultLayers);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => map.getViewPort().resize());

    this.autocompleteRequest.addEventListener(
      "load",
      this.onAutoCompleteSuccess
    );
    this.autocompleteRequest.addEventListener(
      "error",
      this.onAutoCompleteFailure
    );
    this.autocompleteRequest.responseType = "json";

    this.setState({ router: platform.getRoutingService(null, 8), map: map });

    //default coordinates to show fixed route (used in emergency dashboard)
    if (
      this.props &&
      this.props.isFixedRoute &&
      this.props.lat != null &&
      this.props.lng != null
    ) {
      //TODO: hide location search bar
      this.setState({
        destinationCoordinates: {
          lat: this.props.lat,
          lng: this.props.lng,
        },
        isFixedRoute: true,
        incidentAtDestination: this.props.incident,
      });
    }
  }

  /**
   * componentWillUnmount hook
   *
   */
  componentWillUnmount() {
    this.state.map.dispose();
  }

  /**
   * Retrieves the current list of active incidents from the database and assigns them to the component state
   *
   */
  async setIncidents() {
    const incidents = await axios.get("/api/incident/");
    this.setState({ incidents: { incidentList: incidents.data } });
  }

  async setResolved() {
    let incidentAtDestination = this.state.incidentAtDestination;
    incidentAtDestination.active = false;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incidentAtDestination),
    };
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/incident/${incidentAtDestination._id}`,
      requestOptions
    ).then((response) => {
      console.log(response.json());
    });
  }

  /**
   * This function sets the currentCoordinates state to the current position of the user
   *
   */
  async setCurrentPostion() {
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
        });
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }

  /**
   *
   * @param {*} searchString
   */
  autocomplete(searchString) {
    let params =
      "?query=" +
      searchString +
      "&apiKey=" +
      API_KEY +
      "&maxresults=" +
      AUTOCOMPLETE_MAX_RESULTS +
      "&country=" +
      AUTOCOMPLETE_COUNTRY_CODE +
      "&beginHighlight=<strong>" +
      "&endHighlight=</strong>";

    this.autocompleteRequest.open(
      "GET",
      "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json" + params
    );
    this.autocompleteRequest.send();
  }

  /**
   *
   * @param {*} event details of the occurred event
   */
  onAutoCompleteSuccess(event) {
    let searchSuggestions = document.getElementById(SEARCH_SUGGESTIONS_ID);
    //remove all old suggestions from the list
    searchSuggestions.innerHTML = "";
    //now add the new suggestions
    try {
      for (const suggestion of event.target.response.suggestions) {
        let suggestionElement = document.createElement("li");
        suggestionElement.innerHTML = suggestion.label;
        suggestionElement.classList.add("autosuggestElement");
        suggestionElement.onclick = () => {
          let lookupRequest = new XMLHttpRequest();
          lookupRequest.addEventListener("load", (event) => {
            //unpack response from HERE API which is very complicated for some reason
            let responseArr = JSON.parse(event.target.response).response.view;
            if (responseArr.length > 0) {
              let innerArr = responseArr[0].result;
              if (innerArr.length > 0) {
                document.getElementById(SEARCH_BAR_ID).value =
                  innerArr[0].location.address.label;
                document.getElementById(DESTINATION_SPAN_ID).innerHTML =
                  innerArr[0].location.address.label;
                let destLat = innerArr[0].location.displayPosition.latitude;
                let destLng = innerArr[0].location.displayPosition.longitude;
                this.setState({
                  destinationCoordinates: {
                    lat: destLat,
                    lng: destLng,
                  },
                });
              }
            }
          });
          let params =
            "?locationid=" +
            suggestion.locationId +
            "&jsonattributes=1" +
            "&apiKey=" +
            API_KEY;
          lookupRequest.open(
            "GET",
            "https://geocoder.ls.hereapi.com/6.2/geocode.json" + params
          );
          lookupRequest.send();
        };

        //add the created element to the list
        searchSuggestions.appendChild(suggestionElement);
      }
    } catch (TypeError) {
      //do nothing
    }
  }

  /**
   * Callback when the autocomplete fails
   *
   */
  onAutoCompleteFailure() {
    //TODO: add failure handling
    console.log("autocomplete failed");
  }

  /**
   * Callback when the user types in the searchbar
   *
   * @param {*} event details of the occurred event
   */
  onSearchBarKeyUp(event) {
    this.autocomplete(event.target.value);
    event.preventDefault();
  }

  /**
   *
   * @param {*} result
   */
  onRoutingResult(result) {
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
        // Create a linestring to use as a point source for the route line
        let linestring = this.H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let routeLine = new this.H.map.Polyline(linestring, {
          style: { strokeColor: "blue", lineWidth: 3 },
        });

        // Create a marker for the start point:
        let startMarker = new this.H.map.Marker(
          section.departure.place.location
        );

        // Create a marker for the end point:
        let endMarker = new this.H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        this.state.map.addObjects([routeLine, startMarker, endMarker]);
      });
    }
  }

  calculateDisasterArea(orgiLat, origLng, height, width) {}

  /**
   * This function calculates a route from the current position of the user to ...
   * and displays the calculated route on the map.
   *
   */
  async calculateRoute() {
    let disasterAreas = "";
    for (const incident of this.state.incidents.incidentList) {
      let lng1 = parseFloat(incident.longitude.$numberDecimal) + 0.001;
      let lat1 = parseFloat(incident.latitude.$numberDecimal) - 0.001;
      let lng2 = parseFloat(incident.longitude.$numberDecimal) - 0.001;
      let lat2 = parseFloat(incident.latitude.$numberDecimal) + 0.001;
      disasterAreas +=
        "bbox:" + lng1 + "," + lat1 + "," + lng2 + "," + lat2 + "|";
    }

    console.log(disasterAreas);
    let routingParameters = {
      routingMode: ROUTING_MODE,
      transportMode: TRANSPORT_MODE,
      origin:
        this.state.currentCoordinates.lat +
        "," +
        this.state.currentCoordinates.lng,
      destination:
        this.state.destinationCoordinates.lat +
        "," +
        this.state.destinationCoordinates.lng,
      "avoid[areas]": disasterAreas,
      //'avoid[features]':"controlledAccessHighway,tunnel",
      return: "polyline",
    };

    if (this.state.router) {
      this.state.router.calculateRoute(
        routingParameters,
        this.onRoutingResult,
        function (error) {
          alert(error.message);
        }
      );
    } else {
      console.log("Could not calculate route. Router is null");
    }
  }

  /**
   * This function adds an active incident marker to the map
   *
   * @param {*} incidentLat  The lattitude of the incident
   * @param {*} incidentLng The longitude of the incident
   * @param {*} incidentDate The timestamp when the incident occured
   * @param {*} incidentType The type of the incident
   */
  addIncidentMarkerToMap(incidentLat, incidentLng, incidentDate, incidentType) {
    let incidentElement = document.createElement("div");
    incidentElement.classList.add("incidentMarker");

    let incidentDetailsElement = document.createElement("span");
    incidentDetailsElement.classList.add("incidentMarker-details");
    incidentDetailsElement.textContent =
      "Date: " + incidentDate + " Incident: " + incidentType;

    incidentElement.appendChild(incidentDetailsElement);
    let incidentMarkerIcon = new this.H.map.DomIcon(incidentElement);
    let incidentMarker = new this.H.map.DomMarker(
      { lat: incidentLat, lng: incidentLng },
      {
        icon: incidentMarkerIcon,
      }
    );
    this.state.map.addObject(incidentMarker);
  }

  currentPositionMarker() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var curr_coordinates = pos.coords;

      console.log(`Current Latitude : ${curr_coordinates.latitude}`);
      console.log(`Current Longitude: ${curr_coordinates.longitude}`);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    var currentM = new this.H.map.Marker({
      lat: this.state.currentCoordinates.lat,
      lng: this.state.currentCoordinates.lng,
    });
    this.state.map.addObject(currentM);
  }
  /**
   * This function renders the component to the screen
   *
   */
  render() {
    return (
      <div>
        {!this.state.isFixedRoute && (
          <div>
            <input
              type="text"
              id={SEARCH_BAR_ID}
              onKeyUp={this.onSearchBarKeyUp}
              placeholder="Enter Destination"
            ></input>
            <span>Current Destination: </span>
            <span id={DESTINATION_SPAN_ID}> </span>
            <ul id={SEARCH_SUGGESTIONS_ID}></ul>
            <button onClick={() => this.calculateRoute()}>
              Calculate Route
            </button>
            <button onClick={() => this.currentPositionMarker()}>
              Find Current Location
            </button>
          </div>
        )}

        {this.state.isFixedRoute && (
          <ListGroup>
            <ListGroupItem color="warning">
              <div style={{ padding: "5px" }}>
                <h2>Emergency Services Route Director</h2>
                <Button color="primary" onClick={() => this.calculateRoute()}>
                  Show Route
                </Button>{" "}
                <Button
                  color="success"
                  onClick={() => this.setResolved()}
                  type="submit"
                >
                  Set Resolved
                </Button>
              </div>
            </ListGroupItem>
          </ListGroup>
        )}

        <div ref={this.mapRef} style={{ height: "93.5vh" }}></div>
        {this.state.incidents.incidentList.map((incident, i) =>
          this.addIncidentMarkerToMap(
            incident.latitude.$numberDecimal,
            incident.longitude.$numberDecimal,
            incident.date,
            incident.incidentType
          )
        )}
      </div>
    );
  }
}
