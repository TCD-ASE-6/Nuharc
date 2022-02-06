import { combineReducers } from 'redux';
import userReducer from './userReducer';
import incidentReducer from './incidentReducer';

export default combineReducers({
    incidents: incidentReducer,
    user: userReducer
});