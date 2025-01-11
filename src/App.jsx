/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import getPersons from "./module/getPersons";

const Filter = ({ filter, grabFilter }) => {
  return (
    <p>
      filter: <input value={filter} onChange={grabFilter} />
    </p>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  grabInput,
  newNumber,
  grabNumber,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input
          type="text"
          value={newName}
          onChange={grabInput}
          required
          pattern="[a-zA-Z\s]+"
        />
      </div>
      <div>
        number:{" "}
        <input
          type="tel"
          value={newNumber}
          onChange={grabNumber}
          required
          pattern="[0-9-]+"
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Button = ({ text, handleClick }) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  );
};

const Persons = ({ filter, persons, deletePerson }) => {
  return (
    <>
      <div>
        {persons
          ?.slice()
          .filter((p) => p.name?.toLowerCase().includes(filter.toLowerCase()))
          .map((person) => (
            <>
              <p>
                {person.name} {person.number}
              </p>
              <Button
                handleClick={() => deletePerson(person.name, person.id)}
                text="delete"
              />
            </>
          ))}
      </div>
    </>
  );
};

const Notification = ({ message }) => {
  if (message?.includes("added")) {
    return <div className="success">{message}</div>;
  }

  if (message?.includes("updated")) {
    console.log("I am hitting the updated condition!!", message);
    return <div className="success">{message}</div>;
  }
  if (message?.includes("removed")) {
    return (
      <div>
        {console.log(
          "Am I reaching the right condition in the notification?",
          message
        )}
        <p className="error">{message}</p>
      </div>
    );
  }
  return <div>{console.log("Nothing to update")}</div>;
};

const App = (props) => {
  const [persons, setPersons] = useState(props.persons);
  const [newName, setNewName] = useState("");
  const [newNumber, setPhonenumber] = useState("");
  const [filter, setFilter] = useState("");
  const [key, setKey] = useState(props.persons.length + 1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const addPerson = (event) => {
    event.preventDefault();
    const exists = persons.some((item) => item.name === newName);
    const updateObject = persons.find((item) => item.name === newName);

    if (exists && updateObject) {
      const message = `${newName} is already added in the phonebook, replace the old number with the new one ?`;
      const userConfirmed = confirm(message);
      if (userConfirmed) {
        const url = `/persons/${updateObject.id}`;
        const updatePersonObject = {
          ...updateObject,
          number: newNumber,
        };
        console.log("updated person obj", updatePersonObject);
        axios
          .put(url, updatePersonObject)
          .then((response) => {
            console.log(response);
            setPersons(
              persons.map((person) =>
                person.id === updateObject.id ? response.data : person
              )
            );
            setNewName("");
            setPhonenumber("");
            setKey(key + 1);
            setMessage(`${newName}'s number was updated`);
          })
          .catch((error) => {
            console.error("There was an error putting the person!", error);
          });
      } else {
        console.log("Aha no changes");
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: uuidv4(),
      };

      axios
        .post(`/persons/`, personObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setKey(key + 1);
          setNewName("");
          setPhonenumber("");
          setMessage(`${newName} was added to the phonebook`);
          console.log("Trying to add a person personObject:", personObject);
        })
        .catch((error) => {
          console.error("There was an error adding the person!", error);
          setMessage(`Error '${error}' Could not add a person`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };
  const deletePerson = (name, key) => {
    const text = `Do you want to delete ${name}?`;
    const userConfirmed = confirm(text);
    console.log("Am I even getting a name / key", key, name);

    if (userConfirmed) {
      console.log(`${name} has been deleted.`);
      axios
        .delete(`/persons/${key}`)
        .then((response) => {
          console.log(
            "response data after deletion: ",
            name,
            key,
            response.data
          );
          console.log("response asfter deletion", response);
        })
        .then(getPersons().then((p) => setPersons(Object.values(p))))
        .catch((error) => {
          setMessage(
            `Information about ${name} has already been removed from the server`
          );
        });
    } else {
      console.log(`User does not want to delete ${name}`);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const grabInput = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
    return event.target.value;
  };

  const grabNumber = (event) => {
    console.log(event.target.value);
    setPhonenumber(event.target.value);
    return event.target.value;
  };

  const grabFilter = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} grabFilter={grabFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        grabInput={grabInput}
        newNumber={newNumber}
        grabNumber={grabNumber}
      />
      <h3>Numbers</h3>
      <Persons filter={filter} persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
