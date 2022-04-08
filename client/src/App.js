import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import NavBar from "./components/NavBar/NavBar";
import LoginPage from "./components/LoginPage/LoginPage";
import Map3 from "./components/Map/Map3";
import Map2 from "./components/Map/Map2";
import ReportIncident from "./components/ReportIncident/ReportIncident";
import Signup2 from "./components/RegisterPage/Signup2";
import UpdateIncident from "./components/UpdateIncident/UpdateIncident";
import AdminNavigator from "./components/UpdateIncident/AdminNavigator";
import { CookiesProvider } from "react-cookie";
import Logout from "./components/LoginPage/Logout";
import RegisterService from "./components/RegisterPage/RegisterService";

function App() {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Map3 />} />
            <Route path="/map" element={<Map2 />} />
            <Route path="/map3" element={<Map3 />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup2 />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/update-incident" element={<UpdateIncident />} />
            <Route path="/register-service" element={<RegisterService />} />
            <Route path="/admin-navigator" element={<AdminNavigator />} />
          </Routes>
        </Router>
      </Provider>
    </CookiesProvider>
  );
}

export default App;