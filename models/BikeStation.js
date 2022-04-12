const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mongoose Schema for BikeStation
const BikeStationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  availableBikes: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },

  latitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});

// convert into a model and export.
module.exports = BikeStation = mongoose.model("bikes", BikeStationSchema);
