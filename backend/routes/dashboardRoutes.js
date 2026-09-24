import express from "express";

import User from "../models/userModel.js";
import Ticket from "../models/ticketModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN DASHBOARD
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const totalTickets =
        await Ticket.countDocuments();

      const openTickets =
        await Ticket.countDocuments({
          status: "Open",
        });

      const resolvedTickets =
        await Ticket.countDocuments({
          status: "Resolved",
        });

      const technicians =
        await User.countDocuments({
          role: "Technician",
        });

      res.json({
        stats: {
          totalUsers,
          totalTickets,
          openTickets,
          resolvedTickets,
          technicians,
        },
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while loading dashboard",
      });
    }
  }
);

// EMPLOYEE DASHBOARD
router.get(
  "/employee",
  authMiddleware,
  async (req, res) => {
    try {
      const totalTickets =
        await Ticket.countDocuments({
          createdBy: req.user.userId,
        });

      const openTickets =
        await Ticket.countDocuments({
          createdBy: req.user.userId,
          status: "Open",
        });

      const resolvedTickets =
        await Ticket.countDocuments({
          createdBy: req.user.userId,
          status: "Resolved",
        });

      res.json({
        stats: {
          totalTickets,
          openTickets,
          resolvedTickets,
        },
      });
    } catch (error) {
      console.error(
        "Employee dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while loading dashboard",
      });
    }
  }
);

export default router;