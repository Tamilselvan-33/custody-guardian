"use strict";

const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personName: {
      type: String,
      required: true,
      trim: true,
    },
    relationToCitizen: {
      type: String,
      trim: true,
    },
    lastSeenLocation: {
      type: String,
      trim: true,
    },
    incidentDetails: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-custody", "escalated", "legal-review", "closed"],
      default: "open",
    },
    custodyStatus: {
      type: String,
      default: "Awaiting police update",
    },
    healthStatus: {
      type: String,
      default: "Unknown",
    },
    courtProduction: {
      type: String,
      default: "Not reported",
    },
    lastPoliceUpdateAt: Date,
    escalated: {
      type: Boolean,
      default: false,
    },
    escalatedAt: Date,
    escalationReason: String,
    legalActionNotes: String,
    legalActionTakenAt: Date,
    timeline: [
      {
        actorRole: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);

