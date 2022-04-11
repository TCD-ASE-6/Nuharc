import axios from 'axios';
import { LOGIN_USER, SIGNUP_USER, DELETE_USER } from './types';
import API_URL from "../environment";

export const loginUser = (user) => (dispatch) => {
    axios.post(`${API_URL}/api/users/login`, user).then((res) => {
        dispatch({
            type: LOGIN_USER,
            payload: res.data
        })
    });
};

export const signupUser = (user) => (dispatch) => {
    axios.post(`${API_URL}/api/users/signup`, user).then((res) => {
        dispatch({
            type: SIGNUP_USER,
            payload: res.data
        })
    });
};

export const deleteUser = (id) => (dispatch) => {
    axios.delete(`${API_URL}/api/users/${id}`).then((res) => {
        dispatch({
            type:DELETE_USER,
        })
    })
}