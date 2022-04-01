import { UPDATE_INCIDENTS, UPDATE_SINGLE_INCIDENT } from "./incidentActionTypes";
import axios from 'axios';

//TODO: add other operations and use in ui
export const updateIncidentList = () => (dispatch) => {
    axios.get('/api/incident/').then((res) => {
        dispatch({
            type: UPDATE_INCIDENTS,
            payload: res.data
        })
    }).catch(err => {
        console.log("Error in incidentActions. " + err);
    });
};

export const updateSingleIncident = (incident) => (dispatch) => {
    axios.put(`/api/incident/${incident._id}`, incident).then((res) => {
        dispatch({
            type: UPDATE_SINGLE_INCIDENT,
            payload: res.data
        })
    });
};