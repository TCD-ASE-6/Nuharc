import { UPDATE_INCIDENTS, UPDATE_SINGLE_INCIDENT } from "./incidentActionTypes";
import axios from 'axios';
import API_URL from "../environment";

//TODO: add other operations and use in ui
export const updateIncidentList = () => (dispatch) => {
    console.log(API_URL)
    axios.get(`${API_URL}/api/incident/`).then((res) => {
        dispatch({
            type: UPDATE_INCIDENTS,
            payload: res.data
        })
    }).catch(err => {
        console.log("Error in incidentActions. " + err);
    });
};

export const updateSingleIncident = (incident) => (dispatch) => {
    axios.put(`${API_URL}/api/incident/${incident._id}`, incident).then((res) => {
        dispatch({
            type: UPDATE_SINGLE_INCIDENT,
            payload: res.data
        })
    });
};