/* eslint-disable no-undef */
const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }
require("dotenv").config({ path: "../.env" });

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const parsedName = process.argv[2];
const parsedNumber = process.argv[3];

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
});

const Person = mongoose.model("Person", personSchema);

const { v4: uuidv4 } = require("uuid");

const newId = uuidv4();

const person = new Person({
  name: parsedName,
  number: parsedNumber,
  id: newId,
});

if (parsedName && parsedNumber) {
  person.save().then((result) => {
    console.log(`added ${parsedName} number ${parsedNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
