import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../AutoComplete/AutoComplete";
import API_URL from "../../environment";

// HERE API key
const API_KEY = "Z9irXJBDz_jDcLwmi-1WwTBdSTQmBci1wB9QqTzwZMY";
// Initial latitude to center the map on Dublin
const DUBLIN_LAT = 53.34460864423722;
// Initial longitude to center the map on Dublin
const DUBLIN_LNG = -6.276456570972608;
// Initial zoom factor of the map
const INITIAL_ZOOM = 13;
// Element Id of the destination span
const DESTINATION_SPAN_ID = "destinationSpanId";

function ReportIncident(props) {
  let mapRef = React.createRef();
  let autocompleteRequest = new XMLHttpRequest();
  
  //HERE maps instance
  let H = window.H;
  
  // Set State Hooks
  let map;
  const [tempMap, setTempMap] = useState(null);
  const [incidentCoordinates, setIncidentCoordinates] = useState(null);
  const [incidentType, setIncidentType] = useState("");
  const [active, setActive] = useState(true);
  const [incidentList, setIncidentList] = useState([]);
  const [router, setRouter] = useState(null);
  const [incidentAtDestination, setIncidentAtDestination] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [isFixedRoute, setIsFixedRoute] = useState(false);
  
  const navigate = useNavigate();

  const getPlaceFromCoordinates = (coords) => {
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
  };

  /**
   * componentDidMount hook
   *
   */
  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();

    const hereMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: DUBLIN_LAT, lng: DUBLIN_LNG },
      zoom: INITIAL_ZOOM,
      pixelRatio: window.devicePixelRatio || 1,
    });

    const behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(hereMap)
    );

    // Create the default UI components to allow the user to interact with them
    H.ui.UI.createDefault(hereMap, defaultLayers);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => hereMap.getViewPort().resize());

    setRouter(platform.getRoutingService(null, 8));
    map = hereMap;
    if (props && props.isFixedRoute && props.lat != null && props.lng != null) {
      //TODO: hide location search bar
      setDestinationCoordinates({ lat: props.lat, lng: props.lng });
      setIsFixedRoute(true);
      setIncidentAtDestination(props.incident);
    }

    // to be run after constructor (above code)
    // function sets current location from gps.
    setCurrentPostion();

    // return acts as component will unmount.
    return () => {
      map.dispose();
    };
  }, []);

  const setEventListener = () => {
    map.addEventListener("tap", (event) => {
      removeObjectFromMap("incidentLocation");
      let coords = map.screenToGeo(
        event.currentPointer.viewportX,
        event.currentPointer.viewportY
      );
      setIncidentLocation(coords);
      getPlaceFromCoordinates(coords);
    });
  };

  /**
   * This function sets the currentCoordinates state to the current position of the user
   *
   */
  const setCurrentPostion = async () => {
    // Getting the current location
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIncidentCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPositionMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  };

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
  const removeObjectFromMap = (objectID) => {
    for (let object of map.getObjects()) {
      if (object.id === objectID) {
        map.removeObject(object);
      }
    }
  };

  /**
   * This function calculates the users current locations and,
   * set the marker on the map to show the current location
   */
  const setPositionMarker = (coords) => {
    try {
      var currentM = new H.map.Marker({
        lat: coords.lat,
        lng: coords.lng,
      });
      console.log(map === null);
      if (tempMap === null && (map !== null || map !== undefined)) {
        setTempMap(map);
      }

      if (map === undefined || map === null) {
        map = tempMap;
      }
      currentM.id = "incidentLocation";
      removeObjectFromMap("incidentLocation");
      map.addObject(currentM);
      setEventListener();
    } catch (err) {
      console.log("Error in placing marker");
    }
  };

  const setIncidentLocation = (coords) => {
    try {
      console.log(coords);
      setIncidentCoordinates({ lat: coords.lat, lng: coords.lng });
      let coordinates = { lat: coords.lat, lng: coords.lng };
      setPositionMarker(coordinates);
    } catch (err) {
      console.log("Error in fetching coordinates");
    }
  };

  /**
   * Gets called when user presses the submit button to report an incident.
   * This function
   *
   */
  onsubmit = (e) => {
    e.preventDefault();
    const data = {
      longitude: incidentCoordinates.lng,
      latitude: incidentCoordinates.lat,
      incidentType: incidentType,
      active: active,
    };

    console.log(data);

    axios.post(`${API_URL}/api/incident/report`, data).then((res) => {
      // update incidentList in redux store after incident was added
      // Below Call Not needed.
      // updateIncidentList();

      // redirect to home page
      navigate("/");
    });
  };

  /**
   * Gets called when the value of the radio buttons is changed.
   * This function updates the incidentType in the state accordingly
   * @param {*} event contains the new selected value for incidentType
   */
  const onChangeValue = (event) => {
    setIncidentType(event.target.value);
  };

  /**
   * This function renders the component to the screen
   *
   */
  return (
    <div>
      {/* {this.updateCurrentLocation()} */}
      <Button onClick={() => setCurrentPostion()}>Current Location</Button>
      <AutoComplete updateLocation={setIncidentLocation} />
      <p>Report an Incident</p>
      <div ref={mapRef} style={{ height: "50vh" }}></div>
      <div onChange={onChangeValue}>
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
      <button onClick={onsubmit} type="submit">
        Submit
      </button>
    </div>
  );
}

export default ReportIncident;
