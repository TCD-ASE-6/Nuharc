import React from "react";
import axios from "axios";
import "./MapStyle.css";
import {
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Component } from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import Role from "../../helpers/role";
import API_URL from "../../environment";

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
// Radius from disaster location that needs to be avoided in routes (we add this to the coordinates, so ~150m)
const DISASTER_RADIUS = 0.001;
// Disaster radius in meter
const DISASTER_RADIUS_METER = 150;

// safe zone 1
const SAFE_LAT_1 = 53.33810241909542;
const SAFE_LNG_1 = -6.2587451872999305;

// safe zone 2
const SAFE_LAT_2 = 53.33971103377993;
const SAFE_LNG_2 = -6.249285026362085;

// safe zone 3
const SAFE_LAT_3 = 53.35674586966649;
const SAFE_LNG_3 = -6.257488946686209;

class Map3 extends Component {
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
    const safe_zone_1 = new this.H.geo.Point(SAFE_LAT_1,SAFE_LNG_1);
    const safe_zone_2 = new this.H.geo.Point(SAFE_LAT_2,SAFE_LNG_2);
    const safe_zone_3 = new this.H.geo.Point(SAFE_LAT_3,SAFE_LNG_3);
    this.state = {
      map: null,
      destinationCoordinates: {
        lat: 53.35600864423722,
        lng: -6.256456570972608,
      },
      incidents: { incidentList: [] },
      address: "",
      router: null,
      currentMarker: null,
      destinationMarker: null,
      safeZones: [safe_zone_1,safe_zone_2,safe_zone_3],
      role: null,
      modal: false,
    };
    //bind callbacks
    this.onRoutingResult = this.onRoutingResult.bind(this);
    this.onOriginalRoutingResult = this.onOriginalRoutingResult.bind(this);
    this.onSafeZoneRoutingResult = this.onSafeZoneRoutingResult.bind(this);
    this.setDestinationCoordinates = this.setDestinationCoordinates.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.setCurrentPostion();
    this.setIncidents();
  }

  // for popup
  togglePopup() {
    this.setState({
      modal: !this.state.modal,
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
    map.addLayer(defaultLayers.vector.normal.traffic);
    // real time traffic incidents
    //map.addLayer(defaultLayers.vector.normal.trafficincidents);

    const behavior = new this.H.mapevents.Behavior(
      new this.H.mapevents.MapEvents(map)
    );

    // Create the default UI components to allow the user to interact with them
    this.H.ui.UI.createDefault(map, defaultLayers);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => map.getViewPort().resize());

    this.setState({ router: platform.getRoutingService(null, 8), map: map });
    this.addDublinBikeMarkerToMap();

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
        role: this.props.role,
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
    console.log(`In map 3... ${API_URL}`)
    console.log(`process env.. ${process.env.NODE_ENV.trim()}` )
    const incidents = await axios.get(`${API_URL}/api/incident/`);
    this.setState({ incidents: { incidentList: incidents.data } });
  }

  async setResolved() {
    if (this.state.role === Role.EmergencyStaff) {
      let incidentAtDestination = this.state.incidentAtDestination;
      incidentAtDestination.active = false;
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentAtDestination),
      };
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(
        `${API_URL}/api/incident/${incidentAtDestination._id}`,
        requestOptions
      ).then((response) => {
        console.log(response.json());
      });
    } else {
      // if insuffienient permissions then make popup visible.
      this.togglePopup();
    }
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
        this.setPositionMarker(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          "start_point"
        );
        let posInDisasterArea = false;
        for (const incident of this.state.incidents.incidentList) {
          let disasterLng = parseFloat(incident.longitude.$numberDecimal);
          let disasterLat = parseFloat(incident.latitude.$numberDecimal);
          let disasterLocation = new this.H.geo.Point(disasterLat, disasterLng);
          let currentCoordinates =  new this.H.geo.Point( position.coords.latitude, position.coords.longitude);
          if (disasterLocation.distance(currentCoordinates) < DISASTER_RADIUS_METER){
            console.log("user in disaster area");
            posInDisasterArea = true;
            break;
          }
        }
        if (posInDisasterArea) {
          console.log(position.coords.latitude + " " + position.coords.longitude)
          this.calculateNearestSafeZone(position.coords.latitude, position.coords.longitude);
        }
        else{
          this.hideSafeZones()
        }
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }

  /**
   * This function calculates the nearest safe zone from current position
   * @currLat latitude of the user
   * @currentLng longitue of the user
   */
  calculateNearestSafeZone(currLat,currLng){
    console.log("calculate nearest safezone");
    let currentCoordinates =  new this.H.geo.Point(currLat, currLng);
    let currMinimum = Number.MAX_VALUE;
    let nearestSafeZone = null
    for (let currSafeZone of this.state.safeZones){
      let currDistance = currSafeZone.distance(currentCoordinates)
      if (currDistance < currMinimum){
        currMinimum = currDistance
        nearestSafeZone = currSafeZone;
      }
    }
    this.calculateSafeZoneRoute(nearestSafeZone.lat,nearestSafeZone.lng)
    this.createSafeZones()
  }


  /**
   * This function sets the map state so its zoomed to the calculated route with both markers
   */
  zoomToMarkers() {
    this.removeObjectFromMap("group");
    if (!(this.state.destinationMarker === null)) {
      let group = new this.H.map.Group();
      console.log([this.state.currentMarker, this.state.destinationMarker]);
      group.addObjects([
        this.state.currentMarker,
        this.state.destinationMarker,
      ]);
      group.id = "group";

      // this.state.map.addObject(this.state.currentMarker);
      // this.state.map.addObject(this.state.destinationMarker);
      this.state.map.addObject(group);
      this.state.map.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
      });
    }
  }

  /**
   * show the safe areas on the map
   *
   */
  createSafeZones() {
    let circleStyle = {
      strokeColor: "darkgreen",
      fillColor: "rgba(0, 188, 71, 0.4)",
      lineWidth: 10,
    };

    let zone1 = new this.H.map.Circle(
      { lat: SAFE_LAT_1, lng: SAFE_LNG_1 },
      200,
      { style: circleStyle }
    );
    zone1.id = "safe_zone";
    this.state.map.addObject(zone1);
    let zone2 = new this.H.map.Circle(
      { lat: SAFE_LAT_2, lng: SAFE_LNG_2 },
      130,
      { style: circleStyle }
    );
    zone2.id = "safe_zone";
    this.state.map.addObject(zone2);
    let zone3 = new this.H.map.Circle(
      { lat: SAFE_LAT_3, lng: SAFE_LNG_3 },
      100,
      { style: circleStyle }
    );
    zone3.id = "safe_zone";
    this.state.map.addObject(zone3);
  }

  /**
   * this function hides the safe areas on the map
   *
   */
  hideSafeZones() {
    this.removeObjectFromMap("safe_zone");
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
    //map might not be set
    try{
      for (let object of this.state.map.getObjects()) {
        if (object.id === objectID) {
          this.state.map.removeObject(object);
        }
      }
    } catch(error){
      console.log("Error in remove map: " + error)
    }
  }

  /**
   * Callback whıch contaıns the routıng result from the HERE API
   *
   * @param {*} result answer from the server whıch contaıns the route
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
          style: { strokeColor: "blue", lineWidth: 10, fillColor: 'white', lineDash: [0, 1],
          lineTailCap: 'arrow-tail',
          lineHeadCap: 'arrow-head'},
        });

        // Create a marker for the start point:
        let startMarker = new this.H.map.Marker(
          section.departure.place.location
        );

        // Create a marker for the end point:
        let endMarker = new this.H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        routeLine.id = "route_line";
        startMarker.id = "start_point";
        endMarker.id = "end_point";
        this.removeObjectFromMap("route_line");

        // Add the route polyline and the two markers to the map:
        this.state.map.addObjects([routeLine]);
      });
    }
  }

  /**
   * Callback whıch contaıns the routıng result from the HERE API
   *
   * @param {*} result answer from the server whıch contaıns the route
   */
   onOriginalRoutingResult(result) {
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
        // Create a linestring to use as a point source for the route line
        let linestring = this.H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let routeLine = new this.H.map.Polyline(linestring, {
          style: { strokeColor: "grey", lineWidth: 5 },
        });
        this.removeObjectFromMap("orig_route_line");
        routeLine.id = "orig_route_line";

        // Add the route polyline and the two markers to the map:
        this.state.map.addObjects([routeLine]);
      });
    }
  }

  /**
   * Callback whıch contaıns the routıng result from the HERE API
   *
   * @param {*} result answer from the server whıch contaıns the route
   */
   onSafeZoneRoutingResult(result) {
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
        // Create a linestring to use as a point source for the route line
        let linestring = this.H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let routeLine = new this.H.map.Polyline(linestring, {
          style: { strokeColor: "green", lineWidth: 10, fillColor: 'white', lineDash: [0, 1],
          lineTailCap: 'arrow-tail',
          lineHeadCap: 'arrow-head'},
        });

        // Create a marker for the start point:
        let startMarker = new this.H.map.Marker(
          section.departure.place.location
        );

        // Create a marker for the end point:
        let endMarker = new this.H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        routeLine.id = "route_line";
        startMarker.id = "start_point";
        endMarker.id = "end_point";
        this.removeObjectFromMap("route_line");

        // Add the route polyline and the two markers to the map:
        this.state.map.addObjects([routeLine]);
      });
    }
  }
/**
 * Calculate route to safe zone
 * @param {*} destinationLat latitude of safe zone
 * @param {*} destinationLng longitude of safe zone
 */
  async calculateSafeZoneRoute(destinationLat,destinationLng) {
      let disasterAreas = "";
      for (const incident of this.state.incidents.incidentList) {
        let lng1 = parseFloat(incident.longitude.$numberDecimal) + DISASTER_RADIUS;
        let lat1 = parseFloat(incident.latitude.$numberDecimal) - DISASTER_RADIUS;
        let lng2 = parseFloat(incident.longitude.$numberDecimal) - DISASTER_RADIUS;
        let lat2 = parseFloat(incident.latitude.$numberDecimal) + DISASTER_RADIUS;
        disasterAreas +=
          "bbox:" + lng1 + "," + lat1 + "," + lng2 + "," + lat2 + "|";
      }
      let routingParameters  = {
        routingMode: ROUTING_MODE,
        transportMode: TRANSPORT_MODE,
        origin:
          this.state.currentCoordinates.lat +
          "," +
          this.state.currentCoordinates.lng,
        destination:
        destinationLat +
          "," +
          destinationLng,
        "avoid[areas]": disasterAreas,
        return: "polyline",
      };
    if (this.state.router) {
        this.state.router.calculateRoute(
          routingParameters,
          this.onSafeZoneRoutingResult,
          function (error) {
            console.log(error.message);
          });
      }
    else {
      console.log("Could not calculate route. Router is null");
    }
  }

  /**
   * This function calculates a route from the current position of the user to ...
   * and displays the calculated route on the map.
   *
   */
  async calculateRoute(mode) {
    let routingParameters = {}
    if (mode){
      let disasterAreas = "";
      for (const incident of this.state.incidents.incidentList) {
        let lng1 = parseFloat(incident.longitude.$numberDecimal) + DISASTER_RADIUS;
        let lat1 = parseFloat(incident.latitude.$numberDecimal) - DISASTER_RADIUS;
        let lng2 = parseFloat(incident.longitude.$numberDecimal) - DISASTER_RADIUS;
        let lat2 = parseFloat(incident.latitude.$numberDecimal) + DISASTER_RADIUS;
        disasterAreas +=
          "bbox:" + lng1 + "," + lat1 + "," + lng2 + "," + lat2 + "|";
      }
      routingParameters = {
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
        return: "polyline",
      };
    }
    else{
      routingParameters = {
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
        return: "polyline",
      };
    }

    if (this.state.router) {
      if (mode){
        this.state.router.calculateRoute(
          routingParameters,
          this.onRoutingResult,
          function (error) {
            console.log(error.message);
          });
      }
      else{
        this.state.router.calculateRoute(
          routingParameters,
          this.onOriginalRoutingResult,
          function (error) {
            console.log(error.message);
          });
      }
    } else {
      console.log("Could not calculate route. Router is null");
    }
  }

  /**
   * This function adds the markers of dublin bikes stations to the map. If you hover over the symbol, the
   * current occupancy is displayed.
   */
  addDublinBikeMarkerToMap() {
    let request = new XMLHttpRequest();
    request.addEventListener("load", (event) => {
      let responseArr = JSON.parse(event.target.response);
      responseArr.forEach((section) => {
        let innerElement = document.createElement("div");
        innerElement.style.color = "black";
        innerElement.style.width = "30px";
        innerElement.style.height = "30px";
        innerElement.style.marginTop = "-10px";
        innerElement.style.marginLeft = "-10px";
        innerElement.innerHTML = "🚲";

        let incidentElement = document.createElement("div");
        let incidentDetailsElement = document.createElement("div");
        incidentDetailsElement.classList.add("incidentMarker-details");
        incidentDetailsElement.textContent =
          "Station: " +
          section.name +
          " available bikes: " +
          section.available_bikes;

        incidentElement.classList.add("incidentMarker");
        incidentElement.appendChild(incidentDetailsElement);
        incidentElement.appendChild(innerElement);
        //create icon
        let incidentIcon = new this.H.map.DomIcon(incidentElement);

        // create map marker
        let incidentMarker = new this.H.map.DomMarker(
          { lat: section.position.lat, lng: section.position.lng },
          {
            icon: incidentIcon,
          }
        );
        this.state.map.addObject(incidentMarker);
      });
    });
    request.open(
      "GET",
      "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=b1564a98f90c7d2182f10b93848a8e00fe7e7b89"
    );
    request.setRequestHeader("Accept", " application/json");

    request.send();
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
    let innerElement = document.createElement("div");
    innerElement.style.color = "black";
    innerElement.style.width = "30px";
    innerElement.style.height = "30px";
    innerElement.style.marginTop = "-10px";
    innerElement.style.marginLeft = "-10px";
    innerElement.innerHTML = "⚠";

    let incidentElement = document.createElement("div");
    let incidentDetailsElement = document.createElement("div");
    incidentDetailsElement.classList.add("incidentMarker-details");
    incidentDetailsElement.textContent =
      "Date: " + incidentDate + " Incident: " + incidentType;

    incidentElement.classList.add("incidentMarker");
    incidentElement.appendChild(incidentDetailsElement);
    incidentElement.appendChild(innerElement);
    //create icon
    var incidentIcon = new this.H.map.DomIcon(incidentElement);

    // create map marker
    var incidentMarker = new this.H.map.DomMarker(
      { lat: incidentLat, lng: incidentLng },
      {
        icon: incidentIcon,
      }
    );
    this.state.map.addObject(incidentMarker);

    let circleStyle = {
      strokeColor: "red",
      fillColor: "rgba(0, 95, 255, 0.1)",
      lineWidth: 10,
    };
    let circle = new this.H.map.Circle(
      { lat: incidentLat, lng: incidentLng },
      75,
      { style: circleStyle }
    );

    this.state.map.addObject(circle);
  }

  /**
   * This function calculates the users current locations and,
   * set the marker on the map to show the current location
   */
  setPositionMarker(coords, id) {
    let currentM = new this.H.map.Marker({
      lat: coords.lat,
      lng: coords.lng,
    });
    currentM.id = id;
    if (id === "start_point") {
      this.setState({
        currentMarker: currentM,
      })
    } else {
      this.setState({
        destinationMarker: currentM,
      })
    }
    this.removeObjectFromMap(id);
    this.state.map.addObject(currentM);
    this.zoomToMarkers();
  }

  setDestinationCoordinates(coords) {
    this.setState({
      destinationCoordinates: coords,
    });
    this.removeObjectFromMap("route_line");
    this.setPositionMarker(coords, "end_point");
  }

  /**
   * This function renders the component to the screen
   *
   */
  render() {
    return (
      <div>
        {/* pop up modal
            giving an error for now 
        */}
        {/* <Modal isOpen={this.state.modal} toggle={() => this.togglePopup}>
          <ModalHeader toggle={() => this.togglePopup}>
            Unable To Resolve Incident.
          </ModalHeader>
          <ModalBody>Permission Denied.</ModalBody>
        </Modal> */}

        {!this.state.isFixedRoute && (
          <div>
            <AutoComplete updateLocation={this.setDestinationCoordinates} />
            <button onClick={() => {this.calculateRoute(false);this.calculateRoute(true);}}>
              Calculate Route
            </button>
            <button onClick={() => {this.setCurrentPostion();}}>
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

        <div ref={this.mapRef} style={{ height: "87vh" }}></div>
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

export default Map3;
