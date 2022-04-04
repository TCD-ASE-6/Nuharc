const express = require("express");
const router = express.Router();
const res = require("express/lib/response");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
require("dotenv").config();

const User = require("../../models/User");

// @route    GET api/users
// @desc     Get all users
// @access   Public
// TODO add restrictions
router.get("/", auth, (req, res) => {
  User.find()
    .sort({ name: 1 })
    .then((users) => res.json(users));
});

// @route    POST api/users/signup
// @desc     register a new user
// @access   Public
router.post("/signup", (req, res) => {
  // TODO: get 2 passwords from UI, check if they are equal and save one.
  const { name, surname, email, password1, password2, role } = req.body;

  if (!name || !surname || !email || !password1 || !password2 || !role) {
    return res.status(400).json({ message: "Please Enter all fields." });
  }

  if (password1 !== password2) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (password1.length < 6) {
    return res
      .status(400)
      .json({ message: "Password Should be atleast 6 characters." });
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({
      name,
      surname,
      email,
      password: password1,
      role,
    });

    // Create Salt and Hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }

        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.MONTH_IN_SECONDS },
            (err, token) => {
              if (err) {
                throw err;
              }

              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  surname: user.surname,
                  email: user.email,
                  role: user.role,
                },
              });
            }
          );
        });
      });
    });
  });
});

// @route    POST api/users/login
// @desc     log into user account
// @access   Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Enter all fields." });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }

    // check password equality
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: process.env.MONTH_IN_SECONDS },
          (err, token) => {
            if (err) {
              throw err;
            }

            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
              },
            });
          }
        );
      } else {
        return res.status(400).json({ message: "Wrong Password." });
      }
    });
  });
});

// @route    DELETE api/users/{id}
// @desc     deletes an existing user
// @access   Public
router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.remove().then(() => res.json({ success: true }));
    })
    .catch((err) => {
      _message = err.message;
      res.status(404).json({ _message });
    });
});

module.exports = router;
