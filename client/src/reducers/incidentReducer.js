import {
  UPDATE_INCIDENTS,
  UPDATE_SINGLE_INCIDENT,
} from "../actions/incidentActionTypes";
import axios from "axios";
import API_URL from "../environment";

let initialState = {
  incidentList: [],
};

axios
  .get(`${API_URL}/api/incident/`)
  .then((res) => {
    initialState.incidentList = res.data;
  })
  .catch((err) => {
    console.log("Error in incidentReducer. " + err);
  });

export default function (state = initialState, actions) {
  switch (actions.type) {
    case UPDATE_INCIDENTS:
      return {
        ...state,
        incidentList: actions.payload,
      };
    case UPDATE_SINGLE_INCIDENT:
      return state;
    default:
      return state;
  }
}
