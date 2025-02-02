import axios from "axios";
// import persons from '../../backend/index'
/* eslint-disable no-undef */

const getPersons = async () => {
  try {
    const response = await axios.get("/api/people");
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};

export default getPersons;
