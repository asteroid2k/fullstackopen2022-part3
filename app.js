const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { Person, connect } = require("./models/person");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});
const logger = morgan(
  "method :url :status :res[content-length] - :response-time ms :data"
);
app.use(logger);

app.get("/", (req, res) => {
  res.send("🚀\n Goto /api");
});
app.get("/info", async (req, res) => {
  const peopleCount = await Person.count();
  const now = new Date();
  res.send(
    `Phonebook has info for ${peopleCount} person(s)\n ${now.toString()}`
  );
});

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
});

app.post("/api/persons", async (req, res) => {
  try {
    const { name, number } = req.body;
    const validate = name && number && name.length && number.toString().length;
    if (!validate) {
      return res.status(400).json({ error: "Name and number required" });
    }

    const exists = await Person.exists({
      name: { $regex: name, $options: "i" },
    });
    if (exists) {
      return res.status(400).json({ error: "Name exists already" });
    }
    const newPerson = new Person({ name, number });
    const person = await newPerson.save();
    return res.status(201).json(person);
  } catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).send("Person Not Found");
    }
    return res.json(person);
  } catch (error) {
    next(error);
  }
});
app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const { name, number } = req.body;
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      {
        new: true,
      }
    );
    res.json(person);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

connect(process.env.MONGODB_URI);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
