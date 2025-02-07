/* eslint-disable react/prop-types */
import axios from "axios";

const Button = ({ text, handleClick }) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  );
};

const Person = ({ person }) => {
  const deletePerson = (name, key) => {
    console.log("Am I reaching here? ", name);
    const message = `Do you want to delete ${name} ?`;
    const userConfirmed = confirm(message);

    if (userConfirmed) {
      console.log(`${name} has been deleted.`);
      axios
        .delete(`/api/people/${key}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("There was an error deleting the person!", error);
        });
    } else {
      console.log(`User does not want to delete ${name}`);
    }
  };
  return (
    <>
      {person?.name} {person?.number}
      <Button
        handleClick={() => deletePerson(person?.name, person?.id)}
        text="delete"
      />
    </>
  );
};

export default Person;
