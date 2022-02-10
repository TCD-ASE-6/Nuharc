import { UPDATE_INCIDENTS } from "./incidentActionTypes";

export const updateIncidentList = (data) => (dispatch) => {
    
        dispatch({
            type: UPDATE_INCIDENTS,
            payload: data
        })
    
    
};