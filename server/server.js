// Imports
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import passport from "./passportConfig.js";
import { PrismaClient } from "@prisma/client";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(passport.initialize());

// Configure middleware
app.use(
  cors({
    origin: "https://chatty-green-eight.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware for authentication failures
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized", message: err.message });
  }
  next(err);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
