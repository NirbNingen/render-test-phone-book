import axios from "axios";
// import persons from '../../backend/index'
/* eslint-disable no-undef */

const getPersons = async () => {
  const baseUrl = "https://render-test-phone-book.onrender.com/persons";
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
