const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const User = require("../../models/User");

// No need to handle Ids, MongoDB creates them internally.

// GET all users
// get all users from the database
// TODO add restrictions
router.get("/", (req, res) => {
  User.find()
    .sort({ name: 1 })
    .then((users) => res.json(users));
});

// POST user
// Input Arguments: User Object
// creates a new user
router.post("/", (req, res) => {
  // Create a new user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    date: req.body.date,
  });

  // save the new users
  newUser
    .save()
    .then(() => {
      console.log(res.json(newUser));
      res.json(newUser);
    })
    .catch((err) => {
      _message = err.message;
      res.status(400).json({ _message });
    });
});

// DELETE user
// Input Arguments: User Object Id
// delete a user
router.delete('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.remove()
      .then(() => res.json({success: true}));
    })
    .catch((err) => {
      _message = err.message;
      res.status(404).json({ _message });
    });
});

module.exports = router;