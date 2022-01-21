const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mongoose Schema for User
// Blueprint for Users Document in MongoDB
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,   // TODO type: Role?
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

// convert into a model and export.
module.exports = User = mongoose.model("users", UserSchema);