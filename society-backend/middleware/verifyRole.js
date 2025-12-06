// middleware/verifyRole.js
module.exports = function verifyRole(requiredRoles) {
  // Allow single role as string or multiple as array
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found in token" });
    }

    if (!req.user.role) {
      return res.status(403).json({ error: "Forbidden: No role assigned to user" });
    }

    if (!rolesArray.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied: ${req.user.role} not allowed` });
    }

    // ✅ Role is valid → move to next middleware/controller
    next();
  };
};
