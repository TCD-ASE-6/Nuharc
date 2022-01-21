const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = User = mongoose.model("users", userSchema);