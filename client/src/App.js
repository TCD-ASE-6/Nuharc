import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Provider } from "react-redux";
// import store from "./store";

import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    // <Provider store={store}>
      <div className="App">
        <NavBar />
      </div>
    // </Provider>
  );
}

export default App;
