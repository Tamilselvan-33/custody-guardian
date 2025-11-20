"use strict";

const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const alertRoutes = require("./routes/alerts");
const { scheduleEscalationJob } = require("./utils/escalationJob");

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

io.on("connection", () => {
  // No-op: namespaces can be added later
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "custody-guardian-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Unexpected error",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
    scheduleEscalationJob(io);
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });

