import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ============================================================
// CREATE TICKET
// EMPLOYEE
// ============================================================

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
          message: "Title and description are required",
        });
      }

      const ticket = await Ticket.create({
        title: title.trim(),
        description: description.trim(),
        priority: priority || "Medium",
        category: category || "Other",
        createdBy: req.user.userId,
        status: "Open",
        assignedTo: null,
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


// ============================================================
// GET ALL TICKETS
// SYSTEM ADMIN + IT MANAGER + TECHNICIAN
// ============================================================

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


// ============================================================
// GET ASSIGNED TICKETS
// TECHNICIAN
// ============================================================

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
        "Fetch assigned tickets error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching assigned tickets",
      });
    }
  }
);


// ============================================================
// GET MY TICKETS
// EMPLOYEE
// ============================================================

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
          "name email role"
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
          "Server error while fetching my tickets",
      });
    }
  }
);


// ============================================================
// GET ADMIN TICKETS
// SYSTEM ADMIN
// ============================================================

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


// ============================================================
// GET SINGLE TICKET
// EMPLOYEE + TECHNICIAN + IT MANAGER + SYSTEM ADMIN
// ============================================================

router.get(
  "/:ticketId",
  authMiddleware,
  roleMiddleware(
    "Employee",
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.ticketId
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "assignedTo",
          "name email role"
        )
        .populate(
          "comments.user",
          "name email role"
        )
        .populate(
          "evidence.uploadedBy",
          "name email role"
        );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      // Employee can only see their own ticket
      if (
        req.user.role === "Employee" &&
        ticket.createdBy._id.toString() !==
          req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only view your own tickets",
        });
      }

      res.json({
        ticket,
      });
    } catch (error) {
      console.error(
        "Get single ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching ticket",
      });
    }
  }
);


// ============================================================
// TECHNICIAN UPDATE STATUS
// TECHNICIAN ONLY
// ============================================================

router.patch(
  "/:ticketId/status",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        !["In Progress", "Resolved"].includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid technician status",
        });
      }

      const ticket = await Ticket.findById(
        req.params.ticketId
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !==
          req.user.userId
      ) {
        return res.status(403).json({
          message:
            "This ticket is not assigned to you",
        });
      }

      ticket.status = status;

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
          "Ticket status updated successfully",
        ticket: updatedTicket,
      });
    } catch (error) {
      console.error(
        "Technician status update error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating ticket status",
      });
    }
  }
);


// ============================================================
// ADD COMMENT
// EMPLOYEE + TECHNICIAN + IT MANAGER + SYSTEM ADMIN
// ============================================================

router.post(
  "/:ticketId/comments",
  authMiddleware,
  roleMiddleware(
    "Employee",
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Comment cannot be empty",
        });
      }

      const ticket = await Ticket.findById(
        req.params.ticketId
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      // Employee → own ticket only
      if (
        req.user.role === "Employee" &&
        ticket.createdBy.toString() !==
          req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only comment on your own tickets",
        });
      }

      // Technician → assigned tickets only
      if (
        req.user.role === "Technician" &&
        (
          !ticket.assignedTo ||
          ticket.assignedTo.toString() !==
            req.user.userId
        )
      ) {
        return res.status(403).json({
          message:
            "You can only comment on tickets assigned to you",
        });
      }

      ticket.comments.push({
        user: req.user.userId,
        message: message.trim(),
      });

      await ticket.save();

      await ticket.populate(
        "comments.user",
        "name email role"
      );

      res.status(201).json({
        message: "Comment added successfully",
        comments: ticket.comments,
      });
    } catch (error) {
      console.error(
        "Add comment error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while adding comment",
      });
    }
  }
);


// ============================================================
// GET COMMENTS
// ============================================================

router.get(
  "/:ticketId/comments",
  authMiddleware,
  roleMiddleware(
    "Employee",
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.ticketId
      ).populate(
        "comments.user",
        "name email role"
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json({
        comments: ticket.comments || [],
      });
    } catch (error) {
      console.error(
        "Get comments error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching comments",
      });
    }
  }
);


// ============================================================
// ADD GOOGLE DRIVE EVIDENCE
// EMPLOYEE
// ============================================================

router.post(
  "/:ticketId/evidence",
  authMiddleware,
  roleMiddleware("Employee"),
  async (req, res) => {
    try {
      const {
        fileName,
        fileUrl,
        fileType,
      } = req.body;

      if (!fileName || !fileUrl) {
        return res.status(400).json({
          message:
            "File name and Google Drive link are required",
        });
      }

      const ticket = await Ticket.findById(
        req.params.ticketId
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (
        ticket.createdBy.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only add evidence to your own tickets",
        });
      }

      ticket.evidence.push({
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim(),
        fileType: fileType
          ? fileType.trim()
          : "",
        uploadedBy: req.user.userId,
      });

      await ticket.save();

      res.status(201).json({
        message:
          "Evidence added successfully",
        evidence: ticket.evidence,
      });
    } catch (error) {
      console.error(
        "Add evidence error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while adding evidence",
      });
    }
  }
);


// ============================================================
// GET EVIDENCE
// ============================================================

router.get(
  "/:ticketId/evidence",
  authMiddleware,
  roleMiddleware(
    "Employee",
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.ticketId
      ).populate(
        "evidence.uploadedBy",
        "name email role"
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json({
        evidence: ticket.evidence || [],
      });
    } catch (error) {
      console.error(
        "Get evidence error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching evidence",
      });
    }
  }
);


// ============================================================
// EMPLOYEE CONFIRM RESOLUTION
// RESOLVED → CLOSED
// ============================================================

router.patch(
  "/:ticketId/confirm",
  authMiddleware,
  roleMiddleware("Employee"),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.ticketId
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (
        ticket.createdBy.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only confirm your own tickets",
        });
      }

      if (ticket.status !== "Resolved") {
        return res.status(400).json({
          message:
            "Only resolved tickets can be confirmed",
        });
      }

      ticket.status = "Closed";

      await ticket.save();

      res.json({
        message:
          "Resolution confirmed. Ticket closed.",
        ticket,
      });
    } catch (error) {
      console.error(
        "Confirm resolution error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while confirming resolution",
      });
    }
  }
);


// ============================================================
// EMPLOYEE REOPEN TICKET
// RESOLVED/CLOSED → OPEN
// ============================================================

router.patch(
  "/:ticketId/reopen",
  authMiddleware,
  roleMiddleware("Employee"),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.ticketId
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (
        ticket.createdBy.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only reopen your own tickets",
        });
      }

      if (
        ticket.status !== "Resolved" &&
        ticket.status !== "Closed"
      ) {
        return res.status(400).json({
          message:
            "Only resolved or closed tickets can be reopened",
        });
      }

      ticket.status = "Open";

      await ticket.save();

      res.json({
        message:
          "Ticket reopened successfully",
        ticket,
      });
    } catch (error) {
      console.error(
        "Reopen ticket error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while reopening ticket",
      });
    }
  }
);


// ============================================================
// UPDATE TICKET
// SYSTEM ADMIN + IT MANAGER + TECHNICIAN
// ============================================================

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

      const ticket = await Ticket.findById(
        req.params.id
      );

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

        if (
          !allowedStatuses.includes(status)
        ) {
          return res.status(400).json({
            message:
              "Invalid ticket status",
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
          !allowedPriorities.includes(
            priority
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid ticket priority",
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
          !allowedCategories.includes(
            category
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid ticket category",
          });
        }

        ticket.category = category;
      }


      // TITLE

      if (title !== undefined) {
        ticket.title = title.trim();
      }


      // DESCRIPTION

      if (description !== undefined) {
        ticket.description =
          description.trim();
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


// ============================================================
// DELETE TICKET
// SYSTEM ADMIN ONLY
// ============================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(
        req.params.id
      );

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