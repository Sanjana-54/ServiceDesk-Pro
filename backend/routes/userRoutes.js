import express from "express";

import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL TECHNICIANS
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

export default router;