import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Provider } from "react-redux";
import store from "./store";
import NavBar from './components/NavBar/NavBar';
import LoginPage from "./components/LoginPage/LoginPage";
import SignUp from "./components/RegisterPage/SignUp";
import Map from "./components/Map/Map";
import ReportIncident from "./components/ReportIncident/ReportIncident";


function App() {

  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path='/' exact element={<Map />} />
          <Route path='/map' element={<Map />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/report' element={<ReportIncident />} />
        </Routes>
      </Router>
    </Provider>
  );
}


export default App;