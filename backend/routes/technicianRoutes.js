import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import WorkLog from "../models/workLogModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ============================================================
// TECHNICIAN DASHBOARD
// ============================================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const technicianId =
        req.user.userId;

      const [
        assignedTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        highPriorityTickets,
      ] = await Promise.all([
        Ticket.countDocuments({
          assignedTo: technicianId,
        }),

        Ticket.countDocuments({
          assignedTo: technicianId,
          status: "Open",
        }),

        Ticket.countDocuments({
          assignedTo: technicianId,
          status: "In Progress",
        }),

        Ticket.countDocuments({
          assignedTo: technicianId,
          status: {
            $in: [
              "Resolved",
              "Closed",
            ],
          },
        }),

        Ticket.countDocuments({
          assignedTo: technicianId,
          priority: {
            $in: [
              "High",
              "Critical",
            ],
          },
          status: {
            $nin: [
              "Resolved",
              "Closed",
            ],
          },
        }),
      ]);

      const tickets =
        await Ticket.find({
          assignedTo: technicianId,
        })
          .populate(
            "createdBy",
            "name email role department"
          )
          .populate(
            "assignedTo",
            "name email role"
          )
          .sort({
            updatedAt: -1,
          });

      res.json({
        stats: {
          assignedTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          highPriorityTickets,
        },
        tickets,
      });
    } catch (error) {
      console.error(
        "Technician dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load technician dashboard",
      });
    }
  }
);


// ============================================================
// GET MY ASSIGNED TICKETS
// ============================================================

router.get(
  "/tickets",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const tickets =
        await Ticket.find({
          assignedTo:
            req.user.userId,
        })
          .populate(
            "createdBy",
            "name email role department"
          )
          .populate(
            "assignedTo",
            "name email role"
          )
          .sort({
            updatedAt: -1,
          });

      res.json({
        tickets,
      });
    } catch (error) {
      console.error(
        "Technician tickets error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load assigned tickets",
      });
    }
  }
);


// ============================================================
// ADD WORK LOG
// ============================================================

router.post(
  "/tickets/:ticketId/work-logs",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const {
        timeSpent,
        workDescription,
        workType,
        internalNote,
      } = req.body;

      if (
        !timeSpent ||
        Number(timeSpent) <= 0
      ) {
        return res.status(400).json({
          message:
            "Time spent must be greater than zero",
        });
      }

      if (
        !workDescription ||
        !workDescription.trim()
      ) {
        return res.status(400).json({
          message:
            "Work description is required",
        });
      }

      const ticket =
        await Ticket.findById(
          req.params.ticketId
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !==
          req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only add work logs to tickets assigned to you",
        });
      }

      const workLog =
        await WorkLog.create({
          ticket:
            ticket._id,
          technician:
            req.user.userId,
          timeSpent:
            Number(timeSpent),
          workDescription:
            workDescription.trim(),
          workType:
            workType ||
            "Other",
          internalNote:
            internalNote === true,
        });

      const populated =
        await WorkLog.findById(
          workLog._id
        )
          .populate(
            "technician",
            "name email role"
          )
          .populate(
            "ticket",
            "title status priority"
          );

      res.status(201).json({
        message:
          "Work log added successfully",
        workLog:
          populated,
      });
    } catch (error) {
      console.error(
        "Work log error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to add work log",
      });
    }
  }
);


// ============================================================
// GET WORK LOGS FOR A TICKET
// ============================================================

router.get(
  "/tickets/:ticketId/work-logs",
  authMiddleware,
  roleMiddleware(
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const ticket =
        await Ticket.findById(
          req.params.ticketId
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      if (
        req.user.role ===
        "Technician"
      ) {
        if (
          !ticket.assignedTo ||
          ticket.assignedTo.toString() !==
            req.user.userId
        ) {
          return res.status(403).json({
            message:
              "You are not assigned to this ticket",
          });
        }
      }

      const workLogs =
        await WorkLog.find({
          ticket:
            req.params.ticketId,
        })
          .populate(
            "technician",
            "name email role"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        workLogs,
      });
    } catch (error) {
      console.error(
        "Fetch work logs error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load work logs",
      });
    }
  }
);


// ============================================================
// SEND MESSAGE / COMMUNICATION TO REQUESTER
// ============================================================

router.post(
  "/tickets/:ticketId/messages",
  authMiddleware,
  roleMiddleware("Technician"),
  async (req, res) => {
    try {
      const {
        message,
      } = req.body;

      if (
        !message ||
        !message.trim()
      ) {
        return res.status(400).json({
          message:
            "Message is required",
        });
      }

      const ticket =
        await Ticket.findById(
          req.params.ticketId
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      if (
        !ticket.assignedTo ||
        ticket.assignedTo.toString() !==
          req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You can only communicate on tickets assigned to you",
        });
      }

      ticket.comments.push({
        user:
          req.user.userId,
        message:
          message.trim(),
      });

      await ticket.save();

      await ticket.populate(
        "comments.user",
        "name email role"
      );

      res.status(201).json({
        message:
          "Message sent successfully",
        comments:
          ticket.comments,
      });
    } catch (error) {
      console.error(
        "Requester communication error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to send message",
      });
    }
  }
);


// ============================================================
// GET TICKET COMMUNICATION
// ============================================================

router.get(
  "/tickets/:ticketId/messages",
  authMiddleware,
  roleMiddleware(
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const ticket =
        await Ticket.findById(
          req.params.ticketId
        )
          .populate(
            "comments.user",
            "name email role"
          )
          .populate(
            "createdBy",
            "name email role"
          );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      if (
        req.user.role ===
        "Technician"
      ) {
        if (
          !ticket.assignedTo ||
          ticket.assignedTo.toString() !==
            req.user.userId
        ) {
          return res.status(403).json({
            message:
              "You are not assigned to this ticket",
          });
        }
      }

      res.json({
        comments:
          ticket.comments || [],
      });
    } catch (error) {
      console.error(
        "Messages error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load ticket communication",
      });
    }
  }
);


export default router;