// const mongoose = require("mongoose");

import { Schema, model } from 'mongoose';

const AnalyticsLogSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  EventType: {
    type: String,
    required: false,
  },
  Confidence: {
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

const ChallanSchema = new Schema({
  timestamp: {
    type: Date,
    required: false,
  },

  ChallanNo: {
    type: String,
    required: false,
  },

  Status: {
    type: String,
    required: false
  },
  CameraName: {
    type: String,
    required: false,
  },
  CustomerName: {
    type: String,
    required: false,
  },
  Location: {
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


  EventType: {
    type: String,
    required: false,
  },

  LPNumber: {
    type: String,
    required: false,
  },


  SnapshotURL:
  {
    type: String,
    required: false,
  },
  LPImageURL: {
    type: String,
    required: false,
  },
  RLVDImageURL: {
    type: String,
    required: false,
  },
  VideoURL: {
    type: String,
    required: false,
  },
});


export const AnalyticsLog = model("AnalyticsLog", AnalyticsLogSchema)
export const Challan = model("challan", ChallanSchema)
