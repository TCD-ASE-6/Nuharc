import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../AutoComplete/AutoComplete";
import styled, { createGlobalStyle, css } from 'styled-components';

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

const Globalstyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(to bottom, #49c49d, #e1eec3);
  height: 100%;
  margin: 0;
  color: #555;
}
`;

const SharedStyle = css`
  background-color: #eee;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`;

const StyleFormedWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
padding: 0 20px;
`;

const StyleForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

const StyledInput = styled.input`
display: block;
width: 100%;
${SharedStyle}
`;

const StyledButton = styled.button`
display: block;
background-color: #f7797d;
color: #fff;
font-size: .9rem;
border: 0;
border-radius: 5px;
height: 40px;
padding: 0 20px;
cursor: pointer;
box-sizing: border-box;
:hover {
  background-color: red;
}
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 2px;
  margin-bottom: 10px;
`;

const RadioButtonLabel = styled.label`
  position: absolute;
  top: 25%;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
`;
const RadioButton = styled.input`
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin-right: 10px;
  &:hover ~ ${RadioButtonLabel} {
    background: #ccc;
    &::after {
      content: fill;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
  &:checked + ${Item} {
    background: yellowgreen;
    border: 2px solid yellowgreen;
  }
  &:checked + ${RadioButtonLabel} {
    background: yellowgreen;
    border: 1px solid yellowgreen;
    &::after {
      content: fill;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
`;

function ReportIncident(props) {
  let mapRef = React.createRef();
  let autocompleteRequest = new XMLHttpRequest();
  
  //HERE maps instance
  let H = window.H;
  
  // Set State Hooks
  let map;
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

    axios.post("/api/incident/report", data).then((res) => {
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
    // <div>
    //   {/* {this.updateCurrentLocation()} */}
    //   <Button onClick={() => setCurrentPostion()}>Current Location</Button>
    //   <AutoComplete updateLocation={setIncidentLocation} />
    //   <p>Report an Incident</p>
    //   <div ref={mapRef} style={{ height: "50vh" }}></div>
    //   <div onChange={onChangeValue}>
    //     <div>
    //       <input type="radio" value="Fire" name="incident" /> Fire
    //     </div>
    //     <div>
    //       <input type="radio" value="Explosion" name="incident" /> Explosion
    //     </div>
    //     <div>
    //       <input type="radio" value="CarAccident" name="incident" /> Car
    //       Accident
    //     </div>
    //   </div>
    //   <button onClick={onsubmit} type="submit">
    //     Submit
    //   </button>
    // </div>
    <>
            <Globalstyle />
            <StyleFormedWrapper>
            <StyleForm>
                <StyledButton onClick={() => setCurrentPostion()}>Current Location</StyledButton>
                <br></br>
                    <AutoComplete updateLocation={setIncidentLocation} />
            <div><h2>Report an Incident</h2></div>
            <div ref={mapRef} style={{ height: "50vh" }}></div>
                <div onChange={onChangeValue}></div>
                <hr></hr>
                    <Item>
                <RadioButton type="radio" value="Fire" name="incident"/> <RadioButtonLabel />
        <div>Choose Pickup</div>
      </Item>
      <Item>
                <RadioButton type="radio" value="Explosion" name="incident"/> <RadioButtonLabel />
        <div>Explosion</div>
      </Item>
      <Item>
                <RadioButton type="radio" value="CarAccident" name="incident"/> <RadioButtonLabel />
        <div>Car Accident</div>
      </Item>
            <StyledButton onClick={onsubmit} type="submit">
            Submit
            </StyledButton>
            </StyleForm>
            </StyleFormedWrapper>
            </>
  );
}

export default ReportIncident;
