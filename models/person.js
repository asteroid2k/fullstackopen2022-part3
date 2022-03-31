const mongoose = require('mongoose')
const { Schema } = mongoose

const personSchema = new Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{5,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`
    }
  }
})
const Person = mongoose.model('Person', personSchema)

const connect = async (uri) => {
  try {
    await mongoose.connect(uri)
    console.log('Connected')
  } catch (error) {
    console.log('Connection failed')
  }
}

module.exports = { Person, connect }
