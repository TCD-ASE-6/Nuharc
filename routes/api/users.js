const express = require("express");
const router = express.Router();
const res = require("express/lib/response");

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

// @route    GET api/users
// @desc     Get all users
// @access   Public
// TODO add restrictions
router.get("/", (req, res) => {
  User.find()
    .sort({ name: 1 })
    .then((users) => res.json(users));
});

// @route    POST api/users/register
// @desc     register a new user
// @access   Public
router.post("/signup", (req, res) => {
  // TODO: get 2 passwords from UI, check if they are equal and save one.
  const { name, email, password1, password2, role } = req.body;

  if (!name || !email || !password1 || !password2 || !role) {
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
      email,
      password,
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
            config.get("jwtSecret"),
            { expiresIn: 2629746 },
            (err, token) => {
              if (err) {
                throw err;
              }

              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                },
              });
            }
          );

          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        });
      });
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
