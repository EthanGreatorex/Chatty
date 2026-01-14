import jwt from "jsonwebtoken";

// Middleware to handle passport authentication errors
export async function authenticateJWT(req, res, next) {
  const cookies = req.headers.cookie;
  const authCookie = cookies
    ?.split("; ")
    ?.find((c) => /^AuthToken=.*$/.test(c));

  if (!authCookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authCookie.split("=")[1];
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
