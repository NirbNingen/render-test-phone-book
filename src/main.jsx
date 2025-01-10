import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "./index.css";
import getPersons from "./module/getPersons";

// const baseUrl = "http://localhost:3001/persons";

const renderApp = async () => {
  const persons = await getPersons();
  console.log("Persons in main.jsx", persons);
  const personsArray = Object.values(persons);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <App persons={personsArray} />
  );
};

renderApp();

// const persons = await getPersons();
// const renderApp = async () => {
//   axios.get(baseUrl).then((response) => {
//     console.log("response", response, "typeof:", typeof response);
//     const persons = response.data;
//     const personsArray = Object.values(persons);
//     console.log("Persons returning as: ", persons);
//     ReactDOM.createRoot(document.getElementById("root")).render(
//       <App key="1" persons={personsArray} />
//     );
//   });
// };

renderApp();
