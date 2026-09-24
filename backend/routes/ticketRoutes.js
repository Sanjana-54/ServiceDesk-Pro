import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// CREATE TICKET
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        priority,
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          message: "Title and description are required",
        });
      }

      const ticket = await Ticket.create({
        title,
        description,
        category,
        priority,
        createdBy: req.user.userId,
      });

      res.status(201).json({
        message: "Ticket created successfully",
        ticket,
      });
    } catch (error) {
      console.error("Create ticket error:", error);

      res.status(500).json({
        message: "Server error while creating ticket",
      });
    }
  }
);

// GET MY TICKETS
router.get(
  "/my-tickets",
  authMiddleware,
  async (req, res) => {
    try {
      const tickets = await Ticket.find({
        createdBy: req.user.userId,
      }).sort({ createdAt: -1 });

      res.json({
        message: "Tickets fetched successfully",
        tickets,
      });
    } catch (error) {
      console.error("Fetch tickets error:", error);

      res.status(500).json({
        message: "Server error while fetching tickets",
      });
    }
  }
);

// GET ALL TICKETS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({ createdAt: -1 });

      res.json({
        message: "All tickets fetched successfully",
        tickets,
      });
    } catch (error) {
      console.error(
        "Fetch all tickets error:",
        error
      );

      res.status(500).json({
        message: "Server error while fetching tickets",
      });
    }
  }
);

// ASSIGN TICKET
router.patch(
  "/:ticketId/assign",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const { technicianId } = req.body;

      if (!technicianId) {
        return res.status(400).json({
          message: "Technician ID is required",
        });
      }

      const technician = await User.findOne({
        _id: technicianId,
        role: "Technician",
      });

      if (!technician) {
        return res.status(400).json({
          message: "Invalid technician",
        });
      }

      const ticket =
        await Ticket.findByIdAndUpdate(
          req.params.ticketId,
          {
            assignedTo: technicianId,
            status: "Assigned",
          },
          { new: true }
        )
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json({
        message: "Ticket assigned successfully",
        ticket,
      });
    } catch (error) {
      console.error(
        "Assign ticket error:",
        error
      );

      res.status(500).json({
        message: "Server error while assigning ticket",
      });
    }
  }
);

// GET ASSIGNED TICKETS
router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find({
        assignedTo: req.user.userId,
      })
        .populate(
          "createdBy",
          "name email"
        )
        .sort({ createdAt: -1 });

      res.json({
        message: "Assigned tickets fetched successfully",
        tickets,
      });
    } catch (error) {
      console.error(
        "Fetch assigned tickets error:",
        error
      );

      res.status(500).json({
        message: "Server error while fetching tickets",
      });
    }
  }
);

// UPDATE STATUS
router.patch(
  "/:ticketId/status",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "In Progress",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const ticket =
        await Ticket.findOneAndUpdate(
          {
            _id: req.params.ticketId,
            assignedTo: req.user.userId,
          },
          { status },
          { new: true }
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found or not assigned to you",
        });
      }

      res.json({
        message:
          "Ticket status updated successfully",
        ticket,
      });
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating ticket",
      });
    }
  }
);

export default router;