const express = require("express");
const router = express.Router();

// Load BikeStation model
const BikeStation = require("../../models/BikeStation");

/**
 * API to cache available bikes to our own server
 */
router.post("/updateStation", (req, res) => {
    const station = new BikeStation({
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    availableBikes: req.body.availableBikes,
    name: req.body.name,
    });
    station
    .save()
    .catch((err) =>
        res
        .status(400)
        .json({ error: "Unable to update bike station. Error: " + err })
    );
});

/**
 * API to get available bikes from server
 */
router.get("/", (req, res) => {
    BikeStation.find()
    .then((bikes) => res.json(bikes))
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Unable to fetch bike stations. Error: " + err })
    );
});

module.exports = router;