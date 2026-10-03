import express from "express";

import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ========================================
// GET ALL USERS
// SYSTEM ADMIN ONLY
// ========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("_id name email role createdAt")
        .sort({ createdAt: -1 });

      res.json({
        users,
      });
    } catch (error) {
      console.error("Fetch users error:", error);

      res.status(500).json({
        message: "Server error while fetching users",
      });
    }
  }
);


// ========================================
// GET ALL TECHNICIANS
// SYSTEM ADMIN + IT MANAGER
// ========================================

router.get(
  "/technicians",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const technicians = await User.find({
        role: "Technician",
      }).select(
        "_id name email role"
      );

      res.json({
        technicians,
      });
    } catch (error) {
      console.error(
        "Fetch technicians error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching technicians",
      });
    }
  }
);


// ========================================
// CHANGE USER ROLE
// SYSTEM ADMIN ONLY
// ========================================

router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      const allowedRoles = [
        "System Admin",
        "IT Manager",
        "Technician",
        "Employee",
        "Asset Manager",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const user = await User.findById(
        req.params.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.role = role;

      await user.save();

      res.json({
        message: "User role updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Update user role error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating user role",
      });
    }
  }
);


// ========================================
// DELETE USER
// SYSTEM ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      // Prevent admin from deleting themselves
      if (
        req.params.id ===
        req.user.userId
      ) {
        return res.status(400).json({
          message:
            "You cannot delete your own account",
        });
      }

      const user = await User.findById(
        req.params.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting user",
      });
    }
  }
);


export default router;