const express = require("express");
const { io } = require("socket.io-client");
const router = express.Router();

// Load Incident model
const Incident = require("../../models/Incident");

// @route GET api/incident
// @description route to return incident happended today
// @access Public

router.get("/", (req, res) => {
  Incident.find({ active: true })
    .sort({ date: -1 })
    .then((incidents) => res.json(incidents))
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Unable to fetch any incident. Error: " + err })
    );
});

// @route POST api/incident
// @description route to add/save record of incident reported
// @access Public

router.post("/report", (req, res) => {
  const meters = 1000;
  const coef = meters * 0.0000089;
  const less_than_lat = req.body.latitude + coef;
  const more_than_lat = req.body.latitude - coef;
  const less_than_long =
    req.body.longitude + coef / Math.cos(req.body.latitude * 0.018);
  const more_than_long =
    req.body.longitude - coef / Math.cos(req.body.latitude * 0.018);

  Incident.findOne(
    {
      longitude: { $gt: less_than_long, $lte: more_than_long },
      latitude: { $gt: less_than_lat, $lte: more_than_lat },
      incidentType: req.body.incidentType,
      active: true,
    },
    function (err, incident) {
      if (err) console.log(err);
      if (incident) {
        console.log("This incident has already been added" + incident);
      } else {
        const newIncident = new Incident({
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          incidentType: req.body.incidentType,
          active: req.body.active,
        });
        newIncident
          .save()
          .then((incident) => {
            req.io.emit("RELOAD_INCIDENTS", null);
            return res.json({
              msg: "Incident added successfully",
              incident: incident,
            });
          })
          .catch((err) =>
            res
              .status(400)
              .json({ error: "Unable to add this Incident. Error: " + err })
          );
      }
    }
  );
  //res.redirect("/");
});

// @route PUT api/incident/:id
// @description Update incident status
// @access Private

router.put("/:id", (req, res) => {
  Incident.findByIdAndUpdate(req.params.id, req.body)
    .then((incident) => {
      // Pass deleted incident id to reload on client
      req.io.emit("RELOAD_INCIDENTS", incident.id);
      return res.json({ msg: "Incident status updated successfully" })
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Unable to update the Database. Error: " + err })
    );
});

module.exports = router;
