const mongoose = require("mongoose");

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  isGoodBoy: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const AnalyticsLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: false,
  },
  analytics: {
    type: String,
    required: true,
  },

  CameraName: {
    type: String,
    required: true,
  },
  CustomerName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ImageURL: {
    type: String,
    required: false,
  },
  Lat: {
    type: String,
    required: false,
  },
  Long: {
    type: String,
    required: false,
  },
  Speed: {
    type: Number,
    required: false,
  },
  NumberOfObjects: {
    type: Number,
    required: false,
  },
  object_type: {
    type: String,
    required: false,
  },
  vehicle_type: {
    type: String,
    required: false,
  },
  vehicle_make: {
    type: String,
    required: false,
  },
  vehicle_color: {
    type: String,
    required: false,
  },
  vehicle_lpr_number: {
    type: String,
    required: false,
  },
  vehicle_model: {
    type: String,
    required: false,
  },
  VideoURL: {
    type: String,
    required: false,
  },
});

const Dog = mongoose.model("Dog", DogSchema);
const AnalyticsLog = mongoose.model("AnalyticsLog",AnalyticsLogSchema)

module.exports = { Dog , AnalyticsLog};
