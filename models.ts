// const mongoose = require("mongoose");

import { Schema, model } from 'mongoose';

const AnalyticsLogSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  analytics: {
    type: String,
    required: false,
  },

  CameraName: {
    type: String,
    required: false,
  },
  CustomerName: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  // ImageURL: {
  //   type: String,
  //   required: false,
  // },
  ImageURL: {
    file: { type: Buffer, required: false },
    filename: { type: String, required: false },
    mimetype: { type: String, required: false }
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
  isSpeeding: {
    type: Boolean,
    default: false,
    required: false,
  },
  isANPR: {
    type: Boolean,
    default: false,
    required: false,
  },
  isWrongWay: {
    type: Boolean,
    default: false,
    required: false,
  },
  isNoHelmet: {
    type: Boolean,
    default: false,
    required: false,
  },

  isRLVD: {
    type: Boolean,
    default: false,
    required: false,
  },
  isTripleRiding: {
    type: Boolean,
    default: false,     //boolean type
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
  // vehicle_type: {
  //   type: String,
  //   required: false,
  // },
  VehicleType: {
    type: String,
    required: false,
  },
  // vehicle_make: {
  //   type: String,
  //   required: false,
  // },
  vehicle_color: {
    type: String,
    required: false,
  },
  VehicleMake: {
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

  LPNumber: {
    type: String,
    required: false,
  },

  Snapshotpath: {
    type: String,
    required: false,
  },
  LPImagePath: {
    type: String,
    required: false,
  },
  RLVDImagePath: {
    type: String,
    required: false,
  },

  VideoPath: {
    type: String,
    required: false,
  },
  SnapshotURL:
  {
    file: { type: Buffer, required: false },
    filename: { type: String, required: false },
    mimetype: { type: String, required: false }
  },

  LPImageURL: {
    file: { type: Buffer, required: false },
    filename: { type: String, required: false },
    mimetype: { type: String, required: false }
  },
  RLVDImageURL: {
    file: { type: Buffer, required: false },
    filename: { type: String, required: false },
    mimetype: { type: String, required: false }
  },
  VideoURL: {
    file: { type: Buffer, required: false },
    filename: { type: String, required: false },
    mimetype: { type: String, required: false }
  },
});

export const AnalyticsLog = model("AnalyticsLog", AnalyticsLogSchema)
