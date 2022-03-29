const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});
const logger = morgan(
  "method :url :status :res[content-length] - :response-time ms :data"
);
app.use(logger);
app.use(express.static("build"));

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

app.get("/", (req, res) => {
  res.send("🚀\n Goto /api");
});
app.get("/info", (req, res) => {
  const peopleCount = persons.length + 1;
  const now = new Date();
  res.send(
    `Phonebook has info for ${peopleCount} person(s)\n ${now.toString()}`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const validate = name && number && name.length && number.toString().length;
  if (!validate) {
    return res.status(400).json({ error: "Name and number required" });
  }

  const exists = persons.findIndex(
    (p) => p.name.toLocaleLowerCase() === name.toLocaleLowerCase()
  );
  if (exists > -1) {
    return res.status(400).json({ error: "Name exists already" });
  }
  const person = {
    id: Number(Math.random().toString().substring(6)),
    name,
    number,
  };
  persons.push(person);
  return res.status(201).json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) {
    return res.status(404).send("Person Not Found");
  }
  return res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) {
    return res.status(404).send("Person Not Found");
  }
  persons = persons.filter((p) => p.id !== id);
  return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
