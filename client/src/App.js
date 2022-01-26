import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import NavBar from './components/NavBar/NavBar';
import LoginPage from "./components/LoginPage/LoginPage";
import SignUp from "./components/RegisterPage/SignUp";

function App() {
  
  return (
    <Provider store={store}>
      <div className="App">
        <NavBar />
        <LoginPage />
        <SignUp />
      </div>
    </Provider>
  );
}


export default App;