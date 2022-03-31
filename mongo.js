const mongoose = require("mongoose");
const { Schema } = mongoose;

const personSchema = new Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const handler = async (name, number) => {
  if (!name && !number) {
    const persons = await Person.find();
    console.log("PHONEBOOK:");
    persons.forEach((p) => console.log(`${p.name} ${p.number}`));
    return;
  }
  const exists = await Person.exists({ name });
  if (exists) {
    return console.log("Person already exists");
  }
  await Person.create({ name, number });
  console.log(`Added ${name} ${number} to phonebook`);
};

const connect = async (password, name, number) => {
  try {
    await mongoose.connect(
      `mongodb+srv://kuhnzzz:${password}@cluster0.t9gc2.mongodb.net/fullstackopen?retryWrites=true&w=majority`
    );
    await handler(name, number);
  } catch (error) {
    console.log("Connection failed");
  } finally {
    mongoose.connection.close();
  }
};

const [_, __, password, name, number] = process.argv;
connect(password, name, number);
