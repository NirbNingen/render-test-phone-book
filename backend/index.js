/* eslint-disable no-undef */
// const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("dist"));
app.use(express.json());

const corsOptions = {
  // origin: "http://localhost:8081",
  origin: "https://render-test-phone-book.onrender.com:8081",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const { v4: uuidv4 } = require("uuid");
const newId = uuidv4();
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

app.get("/api/people/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/people/:id", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  let person = new Person({
    number: body.number || false,
    ...body,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/people", (request, response, next) => {
  const body = request.body;

  if (body === undefined) {
    return response.status(400).json({ error: "body is missing" });
  }

  if (body?.name === undefined) {
    return response.status(400).json({ error: "name is missing" });
  }

  let person = new Person({
    name: body.name,
    number: body.number || false,
    id: newId,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/people/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/people/:id", (request, response, next) => {
  console.log("ID fetched for delete: ", request.params.id);
  Person.deleteOne({ _id: request.params.id })
    .then((result) => {
      if (result) {
        response.json(result);
        console.log(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Error handling

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

// Error handling

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
