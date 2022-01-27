const express = require('express');
const router = express.Router();

// Load Incident model
const Incident = require('../../models/Incident');

// @route GET api/incident
// @description route to return incident happended today
// @access Public

router.get('/', (req, res) => {
    Incident.find()
    .sort({date: -1})
    .then(incidents => (res.json(incidents)))
    .catch(err => res.status(400).json({error: 'Unable to fetch any incident. Error: ' + err}))
});


// @route POST api/incident
// @description route to add/save record of incident reported
// @access Public

router.post('/report', (req, res) => {
    console.log(req.body);
    const newIncident = new Incident({
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        incidentType: req.body.incidentType,
        active: req.body.active
    });

    newIncident.save()
      .then(incident => res.json({ msg: 'Incident added successfully', incident:incident }))
      .catch(err => res.status(400).json({ error: 'Unable to add this Incident. Error: ' + err }));
  });


// @route PUT api/incident/:id
// @description Update incident status
// @access Private

router.put('/:id', (req, res) => {
    Incident.findByIdAndUpdate(req.params.id, req.body)
      .then(incident => res.json({ msg: 'Incident status updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database. Error: ' + err })
      );
  });

module.exports = router;