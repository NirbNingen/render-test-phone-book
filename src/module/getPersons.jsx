import axios from "axios";
// import persons from '../../backend/index'

const getPersons = async () => {
  try {
    const response = await axios.get(
      "https://phonebook-backend-2x0o.onrender.com/persons"
      // "http://localhost:3001/persons"
    );
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    return [];
  }
};

export default getPersons;
