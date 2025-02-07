import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
        name:{' '}
        <input
          type='text'
          value={newName}
          onChange={grabInput}
          required
          pattern='[a-zA-Z\sïéøøèçàäöü]+'
        />
      </div>
      <div>
        number:{' '}
        <input
          type='tel'
          value={newNumber}
          onChange={grabNumber}
          required
          pattern='[0-9-]+'
        />
      </div>
      <div>
        <button type='submit'>add</button>
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
  const filteredPersons = persons.filter((item) =>
    (item.name?.toLowerCase() ?? '').includes(filter.toLowerCase())
  );
  return (
    <>
      {filteredPersons.map((person) => (
        <>
          <p>
            {person.name} {person.number}
          </p>
          <Button
            handleClick={() => deletePerson(person.name, person.id)}
            text='delete'
          />
        </>
      ))}
    </>
  );
};

const Notification = ({ message }) => {
  if (message?.includes('added')) {
    return <div className='success'>{message}</div>;
  }

  if (message?.includes('updated')) {
    console.log('I am hitting the updated condition!!', message);
    return <div className='success'>{message}</div>;
  }
  if (message?.includes('removed')) {
    return (
      <div>
        {console.log(
          'Am I reaching the right condition in the notification?',
          message
        )}
        <p className='error'>{message}</p>
      </div>
    );
  }
  if (message?.includes('validation failed')) {
    return (
      <div>
        {console.log('Am I reaching the error condition?', message)}
        <p className='error'>{message}</p>
      </div>
    );
  }

  return <div>{console.log('Nothing to update')}</div>;
};

const App = (props) => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setPhonenumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const validPersons = props?.persons?.filter((person) => {
      return (
        typeof person.name === 'string' &&
        typeof person.number === 'string' &&
        typeof person.id === 'string'
      );
    });

    setPersons(validPersons);
  }, [props?.persons]);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearMessage();
    }, 3000);
    console.log('message was changed: ', message);

    return () => clearTimeout(timer);
  }, [message, setMessage]);

  const addPerson = (event) => {
    event.preventDefault();
    const exists = persons.some((item) => item.name === newName);
    const updateObject = persons.find((item) => item.name === newName);

    if (exists && updateObject) {
      const message = `${newName} is already added in the phonebook, replace the old number with the new one ?`;
      const userConfirmed = confirm(message);
      if (userConfirmed) {
        const url = `/api/people/${updateObject.id}`;
        const updatePersonObject = {
          ...updateObject,
          number: newNumber,
        };
        axios
          .put(url, updatePersonObject)
          .then((response) => {
            console.log(response);
            setPersons(
              persons.map((person) =>
                person.id === updateObject.id ? response.data : person
              )
            );
            setNewName('');
            setPhonenumber('');
            setMessage(`${newName}'s number was updated`);
          })
          .catch((error) => {
            console.error('There was an error putting the person!', error);
          });
      } else {
        console.log('Aha no changes');
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: uuidv4(),
      };

      axios
        .post(`/api/people/`, personObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setPhonenumber('');
          setMessage(`${newName} was added to the phonebook`);
          console.log('Trying to add a person personObject:', personObject);
        })
        .catch((error) => {
          setMessage(error?.response?.data?.error);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };
  const deletePerson = (name, key) => {
    const text = `Do you want to delete ${name}?`;
    const userConfirmed = confirm(text);
    console.log('Am I even getting a name / key', key, name);

    if (userConfirmed) {
      console.log(`${name} has been deleted.`);
      axios
        .delete(`/api/people/${key}`)
        .then((response) => {
          console.log(
            'response data after deletion: ',
            name,
            key,
            response.data
          );
          console.log('response asfter deletion', response);
        })
        .then(() => {
          setPersons(persons.filter((person) => person.id !== key));
        })

        .catch(() => {
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

  const handleNameInput = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
    return event.target.value;
  };

  const handleNumberInput = (event) => {
    console.log(event.target.value);
    setPhonenumber(event.target.value);
    return event.target.value;
  };

  const handleFilterInput = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    if (event.target.value) {
      setFilter(event.target.value);
    } else {
      setFilter('');
    }
  };

  return (
    <div>
      <div className='general'>
        <h2>phonebook</h2>
        <Notification message={message} />
        <Filter filter={filter} grabFilter={handleFilterInput} />
        <h3>add a new person or update a number</h3>
        <PersonForm
          newName={newName}
          newNumber={newNumber}
          addPerson={addPerson}
          grabInput={handleNameInput}
          grabNumber={handleNumberInput}
        />
      </div>
      <div className='general'>
        <h3>numbers</h3>
        <Persons
          filter={filter}
          persons={persons}
          deletePerson={deletePerson}
        />
      </div>
    </div>
  );
};

export default App;
