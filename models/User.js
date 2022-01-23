const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

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
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
});

// passport-local-mongoose plugin provides functions like authenticate and serializeUser
UserSchema.plugin(passportLocalMongoose);

// convert into a model and export.
module.exports = User = mongoose.model("users", UserSchema);
