const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    // Check if the authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    // Extract token
const token = authHeader.split(" ")[1];
    // Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request (id & role are essential for complaints)
    req.user = {
      id: decoded.id || decoded._id,     // handle both cases
      role: decoded.role || "resident", // default to resident if not provided
    };
    next();     // Move to next middleware or controller
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
