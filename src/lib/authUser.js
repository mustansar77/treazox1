export async function authUser(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (!decoded.id) throw new Error("Invalid token"); // <-- use `id` here
    if (decoded.role !== "user") throw new Error("Unauthorized: Not a user");

    return decoded; // decoded.id is user._id
  } catch (err) {
    console.error("authUser error:", err.message);
    throw new Error("Invalid token");
  }
}
