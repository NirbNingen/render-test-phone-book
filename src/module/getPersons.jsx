import axios from "axios";
// import persons from '../../backend/index'
/* eslint-disable no-undef */

const getPersons = async () => {
  const baseUrl =
    process.env.VITE_API_BASE_URL + "/persons" ||
    "http://localhost:3001/persons";
  try {
    const response = await axios.get(baseUrl);
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};

export default getPersons;
