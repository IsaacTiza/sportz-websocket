import express from 'express';
import path from "path";
import http from 'http';
import dotenv from "dotenv";
import { matchesRouter } from "./routes/matches.js";
import qs from 'qs';
import connectDB from "./db/db.js";
import { globalErrorHandler } from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import { attachWebSocketServer } from './ws/server.js';

dotenv.config({
  path: path.join(process.cwd(), "src", "config", "config.env"),
});

// Use `qs` to parse query strings into nested objects (helps building mongoose filters)
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST|| '0.0.0.0'

const app = express();
const server = http.createServer(app)

app.set('query parser', (str) => qs.parse(str, { allowDots: true, depth: 10 }));
// JSON middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Sports API!" });
});
app.use("/matches", matchesRouter);


const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated= broadcastMatchCreated

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
server.listen(PORT, HOST, () => {
  const baseURL = HOST === '0.0.0.0'? `http://localhost:${PORT}`:`http://${HOST}:${PORT}`
  connectDB();
  console.log(`Server is running at ${baseURL}`);
  console.log(`WebSocket Server is running at ${baseURL.replace('http', 'ws')}/ws`);
});
