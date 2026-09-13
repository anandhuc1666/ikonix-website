import jwt from "jsonwebtoken";

// ===============================
// ADMIN LOGIN
// ===============================

export const loginAdmin_User = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check username and password
    if (
      username !== "adminikonix" ||
      password !== "ikonix159admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: "adminikonix",
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};