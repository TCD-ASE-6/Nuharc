import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import NavBar from "./components/NavBar/NavBar";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUp from "./components/RegisterPage/SignUp";
import Map3 from "./components/Map/Map3";
import Map2 from "./components/Map/Map2";
import ReportIncident from "./components/ReportIncident/ReportIncident";

import PrivateRoute from "./helpers/PrivateRoute";

// import RoleRedirector from "./helpers/RoleRedirector";

export default class App extends Component {
  // constructor(props) {
  //   super(props);
  //   store.subscribe(this.onStoreUpdate.bind(this));
  // }

  // onStoreUpdate() {
  //   let storeUser = store.getState().user;
  //   console.log(storeUser);
  //   if (storeUser.user != null) {
  //     // TODO: write a functional component to redirect users
  //     { RoleRedirector() }
  //   }
  // }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <NavBar />
          <Routes>
            {/* <Route exact path="/" element={<Map3 />} />
            <Route path="/map" element={<Map2 />} />
            <Route path="/map3" element={<Map3 />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/report" element={<ReportIncident />} /> */}

            <Route exact path="/" element={<Map3 />} />
            <Route path="/map" element={<Map2 />} />
            <Route path="/login" element={<PrivateRoute Component={LoginPage} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/report" element={<PrivateRoute Component={ReportIncident} />} />

          </Routes>
        </Router>
      </Provider>
    );
  }
}
