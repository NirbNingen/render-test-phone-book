/* eslint-disable no-undef */
// const http = require("http");
const express = require("express");

const cors = require("cors");

const app = express();

app.use(express.static("dist"));

app.use(express.json());

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "https://render-test-phone-book.onrender.com:8081",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const Person = require("./models/person");

app.get("/", (req, res) => {
  res.json({
    method: req.method,
    ...req.body,
  });
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/people/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

const { v4: uuidv4 } = require("uuid");

const newId = uuidv4();

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number || false,
    id: newId,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/people/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/people/:id", (request, response) => {
  console.log("ID fetched for delete: ", request.params.id);
  Person.deleteOne({ _id: request.params.id }).then((result) => {
    response.json(result);
    console.log(result);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
