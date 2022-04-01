import axios from 'axios';
import React, { Component, useState } from 'react';
import { updateIncidentList } from '../../actions/incidentActions';
import "../../App.css"
import { connect } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

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
            <>
            <Globalstyle />
            <StyleFormedWrapper>
            <StyleForm>
                {this.updateLocation()}
            <div><h2>Report an Incident</h2></div>
            <div onChange={this.onChangeValue}></div>
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
            <StyledButton onClick={this.onsubmit} type="submit">
            Submit
            </StyledButton>
            </StyleForm>
            </StyleFormedWrapper>
            </>
        // <div>
        //     {this.updateLocation()}
        //     <p>Report an Incident</p>
        //     <div onChange={this.onChangeValue}>
        //         <div>
        //         <input type="radio" value="Fire" name="incident"/> Fire
        //         </div>
        //         <div>
        //         <input type="radio" value="Explosion" name="incident"/> Explosion
        //         </div>
        //         <div>
        //         <input type="radio" value="CarAccident" name="incident"/> Car Accident
        //         </div>
        //     </div>
        //     <button onClick={this.onsubmit} type="submit">
        //     Submit
        //     </button>
        // </div>
        );
    }
}
const mapStateToProps = (state) => ({
    incidentList: state.incidentList
  });

export default connect(mapStateToProps, { updateIncidentList })(ReportIncident);
