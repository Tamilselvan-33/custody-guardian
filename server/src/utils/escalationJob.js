"use strict";

const dayjs = require("dayjs");
const Alert = require("../models/Alert");

const escalateStaleAlerts = async (io) => {
  const cutoff = dayjs().subtract(24, "hour").toDate();
  const alerts = await Alert.find({
    status: { $ne: "closed" },
    escalated: false,
    $or: [
      { lastPoliceUpdateAt: { $exists: false } },
      { lastPoliceUpdateAt: { $lte: cutoff } },
    ],
  });

  if (!alerts.length) {
    return;
  }

  for (const alert of alerts) {
    alert.escalated = true;
    alert.escalatedAt = new Date();
    alert.escalationReason = "No police update within 24 hours";
    alert.status = "escalated";
    alert.timeline.push({
      actorRole: "system",
      message: "Alert escalated to legal team after 24 hours of inactivity",
    });
    await alert.save();
    io?.emit("alert:updated", { type: "escalated", alert });
  }
};

const scheduleEscalationJob = (io, intervalMinutes = 15) => {
  setInterval(() => {
    escalateStaleAlerts(io).catch((err) =>
      console.error("Escalation job failed", err)
    );
  }, intervalMinutes * 60 * 1000);
};

module.exports = {
  scheduleEscalationJob,
  escalateStaleAlerts,
};

