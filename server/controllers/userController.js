import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

// Register a new user
export async function register(req, res) {
  // extract user details from request body
  const { username, email, password, profilePicture } = req.body;

  // before creating, check if the email or username already exists
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: email },
  });
  if (existingUserByEmail) {
    return res.status(400).json({ msg: "Email already in use" });
  }
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username: username },
  });
  if (existingUserByUsername) {
    return res.status(400).json({ msg: "Username already in use" });
  }
  // hash the password before storing
  const hash = await bcrypt.hash(password, 10);

  // create a new user record in the database
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hash,
      profilePicture,
    },
  });

  // generate a JWT token for the authenticated user
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "7h",
  });

  res.setHeader(
    "Set-Cookie",
    `AuthToken=${token}; Path=/; Max-Age=25200; SameSite=Lax; HttpOnly`
  );

  // Also return the id of the user
  res.json({ id: user.id });
}

// Login a new user
export async function login(req, res) {
  // extract login credentials from request body
  const { email, password, rememberMe } = req.body;

  // find the user by email, as email is a unique identifier
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) return res.status(400).json({ msg: "User not found" });

  // compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const expiresIn = rememberMe ? "604800" : "25200";

  // generate a JWT token for the authenticated user
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn });

  res.setHeader(
    "Set-Cookie",
    `AuthToken=${token}; Path=/; Max-Age=${expiresIn}; SameSite=Lax; HttpOnly`
  );
  // Also return the id of the user
  res.json({ id: user.id });
}

// delete a user
export async function deleteUser(req, res) {
  // extract the user's id from the parameters
  const userId = parseInt(req.params.id, 10); // 10 means base 10

  try {
    // Use a transaction to delete messages and user atomically
    await prisma.$transaction(async (tx) => {
      // Delete all messages sent by the user
      await tx.message.deleteMany({
        where: { fromUID: userId },
      });

      // Delete all messages received by the user
      await tx.message.deleteMany({
        where: { toUID: userId },
      });

      // Delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    res.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ deleted: false, msg: "Failed to delete user" });
  }
}

// update user details
export async function updateUserDetails(req, res) {
  const userId = parseInt(req.params.id, 10);
  const { username, profilePicture } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username, profilePicture },
  });
  res.json(updatedUser);
}

// get user profile
export async function getProfile(req, res) {
  const userId = parseInt(req.params.id, 10);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json(user);
}

// check if a user exists
export async function userExists(req, res) {
  const username = req.params.username;
  const user = await prisma.user.findUnique({ where: { username } });
  // Return true if user exists, false otherwise
  const exists = user ? true : false;
  // If the user exists, also return their id
  res.json({ exists, id: user ? user.id : null });
}
