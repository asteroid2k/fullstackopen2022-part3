const mongoose = require("mongoose");
const { Schema } = mongoose;

const personSchema = new Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const connect = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected");
  } catch (error) {
    console.log("Connection failed");
  }
};

module.exports = { Person, connect };
