
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export async function authAdmin(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);

    if (!decoded._id) throw new Error("Invalid token");
    if (decoded.role !== "admin") throw new Error("Unauthorized: Not an admin");

    return decoded;
  } catch (err) {
    console.error("authAdmin error:", err.message);
    throw new Error("Invalid token");
  }
}
