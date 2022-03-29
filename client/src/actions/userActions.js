import axios from 'axios';
import Role from '../helpers/role';
import { LOGIN_USER, SIGNUP_USER, DELETE_USER } from './types';


export const loginUser = (user) => (dispatch) => {
    axios.post(`api/users/login`, user).then((res) => {
        dispatch({
            type: LOGIN_USER,
            payload: res.data
        });
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

export const deleteUser = (id) => (dispatch) => {
    axios.delete(`api/users/${id}`).then((res) => {
        dispatch({
            type:DELETE_USER,
        })
    })
}