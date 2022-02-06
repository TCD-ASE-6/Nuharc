import axios from 'axios';
import React, { Component, useState } from 'react';
import { updateIncidentList } from '../../actions/incidentActions';
import "../../App.css"
import { connect } from 'react-redux';
class ReportIncident extends Component{
    constructor() {
        super();
        this.state = {
            latitude: 0.0,
            longitude: 0.0,
            incidentType: "",
            active: true,
            incidentList: []
        }
        this.updateIncidentList = this.updateIncidentList.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
    };

    /**
     * Updates the state with the current coordinates of the app user
     *
     */
    updateLocation(){
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        });
    }

    /**
     * This function updates the redux store with the current list of active incidents
     *
     */
    updateIncidentList () {
        this.props.updateIncidentList();
    }

    /**
     * Gets called when user presses the submit button to report an incident.
     * This function
     *
     */
    onsubmit = e => {
        e.preventDefault();
        const data = {
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            incidentType: this.state.incidentType,
            active: this.state.active
        };

        axios.post('/api/incident/report', data).then(res => {
            //update incidentList in redux store after incident was added
            this.updateIncidentList()
        });
    };

    /**
     * Gets called when the value of the radio buttons is changed.
     * This function updates the incidentType in the state accordingly
     * @param {*} event contains the new selected value for incidentType
     */
    onChangeValue = event => {
        this.setState({
            incidentType: event.target.value
        });
    }

    render () {
        return (
        <div>
            {this.updateLocation()}
            <p>Report an Incident</p>
            <div onChange={this.onChangeValue}>
                <div>
                <input type="radio" value="Fire" name="incident"/> Fire
                </div>
                <div>
                <input type="radio" value="Explosion" name="incident"/> Explosion
                </div>
                <div>
                <input type="radio" value="CarAccident" name="incident"/> Car Accident
                </div>
            </div>
            <button onClick={this.onsubmit} type="submit">
            Submit
            </button>
        </div>);
    }
}
const mapStateToProps = (state) => ({
    incidentList: state.incidentList
  });

export default connect(mapStateToProps, { updateIncidentList })(ReportIncident);
