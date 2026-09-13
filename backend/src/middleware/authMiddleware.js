import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    // Continue to controller
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;