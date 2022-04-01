import axios from "axios";
import React, { Component, useState } from "react";
import { updateIncidentList } from "../../actions/incidentActions";
import "../../App.css";
import { connect } from "react-redux";
import AutoComplete from "../AutoComplete/AutoComplete";

class ReportIncident extends Component {
  constructor() {
    super();
    this.state = {
      disasterLocation: null,
      incidentType: "",
      active: true,
      incidentList: [],
    };
    this.updateIncidentList = this.updateIncidentList.bind(this);
    // this.updateDisasterLocation = this.updateDisasterLocation.bind(this);
    this.setStateDisasterLocation = this.setStateDisasterLocation.bind(this);
  }

  /**
   * Updates the state with the current coordinates of the app user
   *
   */
  setStateDisasterLocation(coords) {
    this.setState({
      disasterLocation: coords,
    });
  }

  /**
   * This function updates the redux store with the current list of active incidents
   *
   */
  updateIncidentList(data) {
    this.props.updateIncidentList(data);
  }

  /**
   * Gets called when user presses the submit button to report an incident.
   * This function
   *
   */
  onsubmit = (e) => {
    e.preventDefault();
    if (!this.state.disasterLocation) {
      //   console.log("dff");
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      navigator.geolocation.watchPosition(
        (position) => {
          this.setState({
            disasterLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        function error(err) {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
        options
      );
    }
    console.log(this.state.disasterLocation);
    const data = {
      longitude: this.state.disasterLocation.longitude,
      latitude: this.state.disasterLocation.latitude,
      incidentType: this.state.incidentType,
      active: this.state.active,
    };

    axios.post("/api/incident/report", data).then((res) => {
      //update incidentList in redux store after incident was added
      this.updateIncidentList(data);
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

  render() {
    return (
      <div>
        <AutoComplete updateLocation={this.setStateDisasterLocation} />
        <p>Report an Incident</p>
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
