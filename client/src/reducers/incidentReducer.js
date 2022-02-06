import { UPDATE_INCIDENTS } from "../actions/incidentActionTypes";
import axios from 'axios';

let initialState = {
    incidentList: []
};

axios.get('/api/incident/').then((res) => {
    initialState.incidentList = res.data;
}).catch(err => {
    console.log("Error in incidentReducer. " + err);
});

export default function (state = initialState, actions) {
  switch (actions.type) {
    case UPDATE_INCIDENTS:
      return {
        ...state,
        incidentList: actions.payload,
      };
    default:
      return state;
  }
}
