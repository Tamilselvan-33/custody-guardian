"use strict";

const express = require("express");
const Alert = require("../models/Alert");
const { authenticate, authorize } = require("../middleware/auth");
const { escalateStaleAlerts } = require("../utils/escalationJob");

const router = express.Router();

const formatAlert = (alert) => ({
  id: alert._id,
  citizen: alert.citizen,
  personName: alert.personName,
  relationToCitizen: alert.relationToCitizen,
  lastSeenLocation: alert.lastSeenLocation,
  incidentDetails: alert.incidentDetails,
  status: alert.status,
  custodyStatus: alert.custodyStatus,
  healthStatus: alert.healthStatus,
  courtProduction: alert.courtProduction,
  lastPoliceUpdateAt: alert.lastPoliceUpdateAt,
  escalated: alert.escalated,
  escalatedAt: alert.escalatedAt,
  escalationReason: alert.escalationReason,
  legalActionNotes: alert.legalActionNotes,
  legalActionTakenAt: alert.legalActionTakenAt,
  timeline: alert.timeline,
  createdAt: alert.createdAt,
  updatedAt: alert.updatedAt,
});

router.post("/", authenticate, authorize("citizen"), async (req, res) => {
  try {
    const { personName, relationToCitizen, lastSeenLocation, incidentDetails } =
      req.body;
    if (!personName || !incidentDetails) {
      return res
        .status(400)
        .json({ message: "Person name and incident details are required" });
    }

    const alert = await Alert.create({
      citizen: req.user._id,
      personName,
      relationToCitizen,
      lastSeenLocation,
      incidentDetails,
      timeline: [
        {
          actorRole: "citizen",
          message: "Custody alert created",
        },
      ],
    });

    req.io?.emit("alert:updated", { type: "created", alert: formatAlert(alert) });
    res.status(201).json(formatAlert(alert));
  } catch (error) {
    res.status(500).json({ message: "Unable to create alert" });
  }
});

router.get("/mine", authenticate, authorize("citizen"), async (req, res) => {
  try {
    const alerts = await Alert.find({ citizen: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(alerts.map(formatAlert));
  } catch (error) {
    res.status(500).json({ message: "Unable to load alerts" });
  }
});

router.get("/police", authenticate, authorize("police"), async (req, res) => {
  try {
    await escalateStaleAlerts(req.io);
    const alerts = await Alert.find({ status: { $ne: "closed" } })
      .populate("citizen", "fullName email")
      .sort({ updatedAt: -1 });
    res.json(alerts.map(formatAlert));
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch alerts" });
  }
});

router.patch(
  "/:id/police-update",
  authenticate,
  authorize("police"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { custodyStatus, healthStatus, courtProduction, status } = req.body;

      const alert = await Alert.findById(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      if (custodyStatus) alert.custodyStatus = custodyStatus;
      if (healthStatus) alert.healthStatus = healthStatus;
      if (courtProduction) alert.courtProduction = courtProduction;
      if (status) alert.status = status;

      alert.lastPoliceUpdateAt = new Date();
      alert.escalated = false;
      alert.escalatedAt = null;
      alert.escalationReason = undefined;
      alert.timeline.push({
        actorRole: "police",
        message: "Custody details updated",
      });

      await alert.save();
      const payload = formatAlert(alert);
      req.io?.emit("alert:updated", { type: "police-update", alert: payload });
      res.json(payload);
    } catch (error) {
      res.status(500).json({ message: "Unable to update alert" });
    }
  }
);

router.get("/lawyer", authenticate, authorize("lawyer"), async (req, res) => {
  try {
    await escalateStaleAlerts(req.io);
    const alerts = await Alert.find({ escalated: true, status: { $ne: "closed" } })
      .populate("citizen", "fullName email")
      .sort({ escalatedAt: -1 });
    res.json(alerts.map(formatAlert));
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch escalated alerts" });
  }
});

router.patch(
  "/:id/lawyer-action",
  authenticate,
  authorize("lawyer"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { legalActionNotes, status } = req.body;
      const alert = await Alert.findById(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      alert.legalActionNotes = legalActionNotes || "Legal action recorded";
      alert.legalActionTakenAt = new Date();
      if (status) {
        alert.status = status;
      } else {
        alert.status = "legal-review";
      }
      alert.timeline.push({
        actorRole: "lawyer",
        message: "Legal action updated",
      });
      await alert.save();
      const payload = formatAlert(alert);
      req.io?.emit("alert:updated", { type: "lawyer-update", alert: payload });
      res.json(payload);
    } catch (error) {
      res.status(500).json({ message: "Unable to update legal action" });
    }
  }
);

module.exports = router;

