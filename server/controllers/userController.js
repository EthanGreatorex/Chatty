import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Register a new user
export async function register(req, res) {
  // extract user details from request body
  const { username, email, password } = req.body;
  // hash the password before storing
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
  console.log(typeof hash);
  // create a new user record in the database
  const user = await prisma.user.create({
    data: { username, email, password: hash },
  });

  // generate a JWT token for the authenticated user
  const token = jwt.sign({ id: user.id }, "supersecretjwt", {
    expiresIn: "7h",
  });
  // Also return the id of the user
  res.json({ token, id: user.id });
}

// Login a new user
export async function login(req, res) {
  // extract login credentials from request body
  const { email, password } = req.body;
  // find the user by email, as email is a unique identifier
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ msg: "User not found" });

  // compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  // generate a JWT token for the authenticated user
  const token = jwt.sign({ id: user.id }, "supersecretjwt", {
    expiresIn: "7h",
  });
  // Also return the id of the user
  res.json({ token, id: user.id });
}

// get user profile
export async function getProfile(req, res) {
  const userId = parseInt(req.params.id, 10);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json(user);
}

// check if a user exists
export async function userExists(req, res) {
  console.log(
    "Hitting user exists endpoint with username:",
    req.params.username
  );
  const username = req.params.username;
  const user = await prisma.user.findUnique({ where: { username: username } });
  res.json({ exists: !!user });
}
