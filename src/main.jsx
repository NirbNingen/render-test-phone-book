/* eslint-disable no-undef */
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "./index.css";
import getPersons from "./module/getPersons";

// axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.baseURL = "https://render-test-phone-book.onrender.com:443";

const renderApp = async () => {
  const persons = await getPersons();
  console.log("Persons in main.jsx", persons);
  const personsArray = Object.values(persons);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <App persons={personsArray} />
  );
};

renderApp();
