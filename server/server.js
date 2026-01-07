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
    origin: "https://chatty-green-eight.vercel.app" || "http://localhost:5173",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use(passport.initialize());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
