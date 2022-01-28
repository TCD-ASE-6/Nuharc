import axios from 'axios';
import { LOGIN_USER, SIGNUP_USER } from './types';

export const loginUser = (user) => (dispatch) => {
    axios.post(`api/users/login`, user).then((res) => {
        dispatch({
            type: LOGIN_USER,
            payload: res.data
        })
    });
};

export const signupUser = (user) => (dispatch) => {
    axios.post(`api/users/signup`, user).then((res) => {
        dispatch({
            type: SIGNUP_USER,
            payload: res.data
        })
    });
};