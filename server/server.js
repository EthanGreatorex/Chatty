// Imports
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import passport from "./passportConfig.js";
import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const app = express();

const PORT = process.env.PORT || 3000;

// Configure authentication
// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET || "supersecretkey",
// };

// passport.use(
//   new Strategy(options, async (jwt_payload, done) => {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id: jwt_payload.id },
//       });
//       if (user) return done(null, user);
//       return done(null, false);
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );

app.use(passport.initialize());

// Configure middleware
app.use(
  cors({
    // origin: "https://chatty-green-eight.vercel.app" || "http://localhost:5173",
    origin: "http://localhost:5173",
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
