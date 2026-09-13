import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/adminSchema.js";

// ======================================================
// ADMIN LOGIN
// ======================================================

export const adminLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // -----------------------------------------------
    // FIND ADMIN
    // -----------------------------------------------

    const admin =
      await Admin.findOne({
        email: email
          .trim()
          .toLowerCase(),
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // CHECK PASSWORD
    // -----------------------------------------------

    const passwordMatch = admin.password
   

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // CREATE JWT
    // -----------------------------------------------

    const token =
      jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};


