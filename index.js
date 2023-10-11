require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { generateId, personExists } = require("./helpers/persons");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (request, response) => JSON.stringify(request.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/info", (request, response) => {
    const count = Person.count().then((count) => {
        const date = new Date();
        response.send(
            `<p>Phonebook has info for ${count} people</p><p>${date}</p>`
        );
    });
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => response.json(person))
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: "name missing" });
    }
    if (!body.number) {
        return response.status(400).json({ error: "number missing" });
    }

    // if (personExists(persons, body.name)) {
    //     return response.status(400).json({ error: "name must be unique" });
    // }

    const newPerson = Person({
        name: body.name,
        number: body.number,
    });

    newPerson.save().then((person) => {
        response.json(person);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((newPerson) => response.json(newPerson))
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((person) => response.status(204).end())
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
