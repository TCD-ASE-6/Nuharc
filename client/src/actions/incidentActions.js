import { UPDATE_INCIDENTS } from "./incidentActionTypes";
import axios from 'axios';

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