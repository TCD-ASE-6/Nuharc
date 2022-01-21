import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Provider } from "react-redux";
// import store from "./store";

import NavBar from "./components/NavBar/NavBar";
import Map from "./components/Map/Map";
import React, { Component, useEffect, useState } from "react";

function App() {
  return (
    // <Provider store={store}>
    <div className="App">
      <NavBar />
      <Map />
    </div>
    // </Provider>
  );
}

export default App;
