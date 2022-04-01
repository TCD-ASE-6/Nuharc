const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for Incident
 */
const IncidentSchema = new Schema({

  longitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },

  latitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },

  incidentType: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: true
  },

  date: {
    type: Date,
    default: Date.now
  },
  
});

// convert into a model and export.
module.exports = Incident = mongoose.model("incident", IncidentSchema);