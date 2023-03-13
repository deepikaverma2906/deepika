// const mongoose = require("mongoose");
 
import { Schema,model } from 'mongoose';

const AnalyticsLogSchema  = new Schema({
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

export const AnalyticsLog = model("AnalyticsLog",AnalyticsLogSchema)
