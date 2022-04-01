import React, { Component, useState } from "react";
import axios from "axios";
import { updateIncidentList } from "../../actions/incidentActions";
import "../../App.css";
import { connect } from "react-redux";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import AutoComplete from "../AutoComplete/AutoComplete";

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
// Country code HERE map API
const AUTOCOMPLETE_COUNTRY_CODE = "IRL";
// Max retrieved results for autocompletion
const AUTOCOMPLETE_MAX_RESULTS = 5;
// Element Id of the search suggestions
const SEARCH_SUGGESTIONS_ID = "searchSuggestionsId";
// Element Id of the search suggestions
const SEARCH_BAR_ID = "searchBarId";
// Element Id of the destination span
const DESTINATION_SPAN_ID = "destinationSpanId";

class ReportIncident extends Component {
  mapRef = React.createRef();
  autocompleteRequest = new XMLHttpRequest();
  //HERE maps instance
  H = window.H;

  /**
   * constructor
   *
   */
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      incidentCoordinates: null,
      incidentType: "",
      active: true,
      incidentList: [],
    };
    //bind callbacks
    this.updateIncidentList = this.updateIncidentList.bind(this);
    // this.updateCurrentLocation = this.updateCurrentLocation.bind(this);
    this.setIncidentLocation = this.setIncidentLocation.bind(this);
    this.setCurrentPostion();
  }

  getPlaceFromCoordinates(coords) {
    let params =
      "?at=" +
      coords.lat +
      "," +
      coords.lng +
      "&lang=en-US" +
      "&apiKey=" +
      API_KEY;

    axios
      .get("https://revgeocode.search.hereapi.com/v1/revgeocode" + params)
      .then((res) => {
        document.getElementById(DESTINATION_SPAN_ID).innerHTML =
          res.data.items[0].title;
      })
      .catch((err) => {
        console.log(err);
      });
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
    // real time traffic information
    // map.addLayer(defaultLayers.vector.normal.traffic);
    // real time traffic incidents
    // map.addLayer(defaultLayers.vector.normal.trafficincidents);

    const behavior = new this.H.mapevents.Behavior(
      new this.H.mapevents.MapEvents(map)
    );

    // Create the default UI components to allow the user to interact with them
    this.H.ui.UI.createDefault(map, defaultLayers);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => map.getViewPort().resize());

    this.setState(
      { router: platform.getRoutingService(null, 8), map: map },
      () => {
        console.log(this.state.map, "Map State is set.");
      }
    );

    // this.setEventListener(this.state.map);

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

  setEventListener() {
    this.state.map.addEventListener("tap", (event) => {
      this.removeObjectFromMap("incidentLocation");
      let coords = this.state.map.screenToGeo(
        event.currentPointer.viewportX,
        event.currentPointer.viewportY
      );
      this.setIncidentLocation(coords);
      this.getPlaceFromCoordinates(coords);
    });
  }

  getCoordinatesOnClick() {}

  /**
   * componentWillUnmount hook
   *
   */
  componentWillUnmount() {
    this.state.map.dispose();
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          incidentCoordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
        this.setPositionMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
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
   * This "removeObjectFromMap" function removes the objects from the map (based on the object IDs).
   * Throught this function, we can remove the old markers and polylines.
   * ## ====================== ##
   * we used the logic from the source below.
   * source: https://stackoverflow.com/questions/34013037/how-to-remove-previous-routes-in-here-js-api
   * ## ====================== ##
   * @param {*} objectID ID of the Object that is removed from the map.
   */
  removeObjectFromMap(objectID) {
    for (let object of this.state.map.getObjects()) {
      if (object.id === objectID) {
        this.state.map.removeObject(object);
      }
    }
  }

  /**
   * This function calculates the users current locations and,
   * set the marker on the map to show the current location
   */
  setPositionMarker(coords) {
    try {
      var currentM = new this.H.map.Marker({
        lat: coords.lat,
        lng: coords.lng,
      });
      // console.log(currentM);
      console.log(this.state.map === null);
      currentM.id = "incidentLocation";
      this.removeObjectFromMap("incidentLocation");
      this.state.map.addObject(currentM);
      this.setEventListener();
    } catch (err) {
      console.log("Error in placing marker");
    }
  }

  setIncidentLocation(coords) {
    try {
      console.log(coords);
      this.setState({
        incidentCoordinates: {
          lat: coords.lat,
          lng: coords.lng,
        },
      });
      this.setPositionMarker(this.state.incidentCoordinates);
    } catch (err) {
      console.log("Error in fetching coordinates");
    }
  }

  /**
   * This function updates the redux store with the current list of active incidents
   *
   */
  updateIncidentList() {
    this.props.updateIncidentList();
  }

  /**
   * Gets called when user presses the submit button to report an incident.
   * This function
   *
   */
  onsubmit = (e) => {
    e.preventDefault();
    const data = {
      longitude: this.state.incidentCoordinates.lng,
      latitude: this.state.incidentCoordinates.lat,
      incidentType: this.state.incidentType,
      active: this.state.active,
    };

    console.log(data);

    axios.post("/api/incident/report", data).then((res) => {
      //update incidentList in redux store after incident was added
      this.updateIncidentList();
    });
  };

  /**
   * Gets called when the value of the radio buttons is changed.
   * This function updates the incidentType in the state accordingly
   * @param {*} event contains the new selected value for incidentType
   */
  onChangeValue = (event) => {
    this.setState({
      incidentType: event.target.value,
    });
  };

  /**
   * This function renders the component to the screen
   *
   */
  render() {
    return (
      <div>
        {/* {this.updateCurrentLocation()} */}
        <Button onClick={() => this.setCurrentPostion()}>
          Current Location
        </Button>
        <AutoComplete updateLocation={this.setIncidentLocation} />
        <p>Report an Incident</p>
        <div ref={this.mapRef} style={{ height: "50vh" }}></div>
        <div onChange={this.onChangeValue}>
          <div>
            <input type="radio" value="Fire" name="incident" /> Fire
          </div>
          <div>
            <input type="radio" value="Explosion" name="incident" /> Explosion
          </div>
          <div>
            <input type="radio" value="CarAccident" name="incident" /> Car
            Accident
          </div>
        </div>
        <button onClick={this.onsubmit} type="submit">
          Submit
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  incidentList: state.incidentList,
});

export default connect(mapStateToProps, { updateIncidentList })(ReportIncident);
