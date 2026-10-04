import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ========================================
// CREATE TICKET
// EMPLOYEE
// ========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Employee"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        priority,
        category,
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          message:
            "Title and description are required",
        });
      }

      const ticket = await Ticket.create({
        title,
        description,
        priority: priority || "Medium",
        category: category || "Other",
        createdBy: req.user.userId,
        status: "Open",
      });

      res.status(201).json({
        message: "Ticket created successfully",
        ticket,
      });
    } catch (error) {
      console.error(
        "Create ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating ticket",
      });
    }
  }
);


// ========================================
// GET ALL TICKETS
// SYSTEM ADMIN + IT MANAGER + TECHNICIAN
// ========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician"
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
        tickets,
      });
    } catch (error) {
      console.error(
        "Fetch all tickets error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching tickets",
      });
    }
  }
);


// ========================================
// GET MY TICKETS
// EMPLOYEE
// ========================================

router.get(
  "/my-tickets",
  authMiddleware,
  roleMiddleware("Employee"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find({
        createdBy: req.user.userId,
      })
        .populate(
          "assignedTo",
          "name email"
        )
        .sort({ createdAt: -1 });

      res.json({
        tickets,
      });
    } catch (error) {
      console.error(
        "Fetch my tickets error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching tickets",
      });
    }
  }
);


// backend/routes/ticketRoutes.js
// ADD THIS ROUTE BEFORE ANY "/:id" ROUTES

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({ createdAt: -1 });

      res.json({
        tickets,
      });
    } catch (error) {
      console.error(
        "Admin fetch tickets error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching tickets",
      });
    }
  }
);

// ========================================
// ASSIGN TICKET TO TECHNICIAN
// SYSTEM ADMIN + IT MANAGER
// ========================================

router.patch(
  "/:id/assign",
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
          message: "Technician is required",
        });
      }

      const ticket = await Ticket.findById(
        req.params.id
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      const technician = await User.findOne({
        _id: technicianId,
        role: "Technician",
      });

      if (!technician) {
        return res.status(400).json({
          message:
            "Selected user is not a technician",
        });
      }

      ticket.assignedTo = technician._id;

      await ticket.save();

      const updatedTicket =
        await Ticket.findById(ticket._id)
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      res.json({
        message:
          "Ticket assigned successfully",
        ticket: updatedTicket,
      });

    } catch (error) {
      console.error(
        "Assign ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while assigning ticket",
      });
    }
  }
);
// ========================================
// UPDATE TICKET
// SYSTEM ADMIN + IT MANAGER + TECHNICIAN
// ========================================

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician"
  ),
  async (req, res) => {
    try {
      const {
        status,
        assignedTo,
        priority,
        category,
        title,
        description,
      } = req.body;

      const ticket =
        await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }


      // STATUS

      if (status !== undefined) {
        const allowedStatuses = [
          "Open",
          "In Progress",
          "Resolved",
          "Closed",
        ];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            message: "Invalid ticket status",
          });
        }

        ticket.status = status;
      }


      // ASSIGNED TECHNICIAN

      if (assignedTo !== undefined) {

        if (
          assignedTo === null ||
          assignedTo === ""
        ) {
          ticket.assignedTo = null;
        } else {

          const technician =
            await User.findOne({
              _id: assignedTo,
              role: "Technician",
            });

          if (!technician) {
            return res.status(400).json({
              message:
                "Selected user is not a technician",
            });
          }

          ticket.assignedTo =
            technician._id;
        }
      }


      // PRIORITY

      if (priority !== undefined) {

        const allowedPriorities = [
          "Low",
          "Medium",
          "High",
          "Critical",
        ];

        if (
          !allowedPriorities.includes(priority)
        ) {
          return res.status(400).json({
            message: "Invalid ticket priority",
          });
        }

        ticket.priority = priority;
      }


      // CATEGORY

      if (category !== undefined) {

        const allowedCategories = [
          "Hardware",
          "Software",
          "Network",
          "Access",
          "Other",
        ];

        if (
          !allowedCategories.includes(category)
        ) {
          return res.status(400).json({
            message: "Invalid ticket category",
          });
        }

        ticket.category = category;
      }


      // TITLE

      if (title !== undefined) {
        ticket.title = title;
      }


      // DESCRIPTION

      if (description !== undefined) {
        ticket.description =
          description;
      }


      await ticket.save();

      const updatedTicket =
        await Ticket.findById(ticket._id)
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      res.json({
        message:
          "Ticket updated successfully",
        ticket: updatedTicket,
      });

    } catch (error) {
      console.error(
        "Update ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating ticket",
      });
    }
  }
);


// ========================================
// DELETE TICKET
// SYSTEM ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const ticket =
        await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      await Ticket.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Ticket deleted successfully",
      });

    } catch (error) {
      console.error(
        "Delete ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting ticket",
      });
    }
  }
);


export default router;