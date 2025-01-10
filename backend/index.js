/* eslint-disable no-undef */
// const http = require("http");
const express = require("express");

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: "a8ff5fd1-b0fc-4496-bc82-41a9ce52800d",
    name: "Henri Banana",
    number: "0676872398",
  },
  {
    id: "6af84a70-2a61-41a0-826c-26c13f45136b",
    name: "Andrzej Lech",
    number: "23478578290",
  },
  {
    name: "Magdalena Hezlarova",
    number: "47-23478294",
    id: "530c597c-a1c5-4dee-ba67-c225ee9aadcb",
  },
  {
    id: "a57dc030-bd4a-4d00-a087-de1fa1d4398e",
    name: "Georgio Armani",
    number: "748972482749",
  },
  {
    id: "0a3fd72b-217d-484d-85fb-07c63e96246e",
    name: "Anne Savage",
    number: "24678242920",
  },
];

app.get("/", (req, res) => {
  res.json({
    method: req.method,
    ...req.body,
  });
});

app.get("/persons", (req, res) => {
  console.log("PERSONS sent as: ", persons);
  res.json({ method: req.method, ...persons });
  console.log("response.json persons is from backend: ", res.json(persons));
});

app.post("/persons", (req, res) => {
  console.log("PERSONS sent as: ", persons);
  res.json({ method: req.method, ...req.body });
});

app.get("/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json({ method: req.method, ...person });
  } else {
    // response.send(`Person id: ${id} does not exist `);
    body = "";
    res.status(404);
  }
});

app.delete("/persons/:id", (req, res) => {
  console.log("PERSONS sent as: ", persons);
  const id = req.params.id;
  console.log("id is: ", id);
  persons = persons.filter((person) => person.id !== id);
  console.log("personse id and person is", persons);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
