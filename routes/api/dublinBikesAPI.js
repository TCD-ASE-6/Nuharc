const express = require("express");
const router = express.Router();

// Load BikeStation model
const BikeStation = require("../../models/BikeStation");

router.put("/updateStation", (req, res) => {
    const station = new BikeStation({
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    availableBikes: req.body.availableBikes,
    name: req.body.active,
    });
    station
    .save()
    .catch((err) =>
        res
        .status(400)
        .json({ error: "Unable to update bike station. Error: " + err })
    );
});

/*router.get("/", (req, res) => {
    
});*/