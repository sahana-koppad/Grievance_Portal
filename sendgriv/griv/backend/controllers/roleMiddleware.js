// roleMiddleware.js
import jwt from "jsonwebtoken";

export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from headers
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Add decoded data (userId, role, etc.) to req object

      // Check if the user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
