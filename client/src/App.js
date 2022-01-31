import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import { Provider } from "react-redux";
import store from "./store";
import NavBar from './components/NavBar/NavBar';
import LoginPage from "./components/LoginPage/LoginPage";
import SignUp from "./components/RegisterPage/SignUp";
import Map from "./components/Map/Map";

function App() {
  
  return (
    <Provider store={store}>
      <div className="App">
        <NavBar />
        <Map />
        <LoginPage />
        <SignUp />
      </div>
    </Provider>
  );
}


export default App;