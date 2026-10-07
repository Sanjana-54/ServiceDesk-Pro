import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import WorkLog from "../models/workLogModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/support-performance",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const technicians =
        await User.find({
          role: "Technician",
          isActive: true,
        }).select(
          "name email department"
        );

      const report =
        await Promise.all(
          technicians.map(
            async (technician) => {
              const [
                total,
                active,
                resolved,
                workLogs,
              ] =
                await Promise.all([
                  Ticket.countDocuments({
                    assignedTo:
                      technician._id,
                  }),

                  Ticket.countDocuments({
                    assignedTo:
                      technician._id,
                    status: {
                      $in: [
                        "Open",
                        "In Progress",
                      ],
                    },
                  }),

                  Ticket.countDocuments({
                    assignedTo:
                      technician._id,
                    status: {
                      $in: [
                        "Resolved",
                        "Closed",
                      ],
                    },
                  }),

                  WorkLog.find({
                    technician:
                      technician._id,
                  }).select(
                    "timeSpent"
                  ),
                ]);

              const totalMinutes =
                workLogs.reduce(
                  (
                    totalTime,
                    log
                  ) =>
                    totalTime +
                    Number(
                      log.timeSpent ||
                        0
                    ),
                  0
                );

              return {
                technician,
                totalTickets:
                  total,
                activeTickets:
                  active,
                resolvedTickets:
                  resolved,
                workLogCount:
                  workLogs.length,
                totalWorkMinutes:
                  totalMinutes,
              };
            }
          )
        );

      res.json({
        report,
      });
    } catch (error) {
      console.error(
        "Performance report error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to generate performance report",
      });
    }
  }
);


router.get(
  "/ticket-summary",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const [
        total,
        open,
        inProgress,
        resolved,
        closed,
        critical,
        high,
      ] = await Promise.all([
        Ticket.countDocuments(),

        Ticket.countDocuments({
          status: "Open",
        }),

        Ticket.countDocuments({
          status: "In Progress",
        }),

        Ticket.countDocuments({
          status: "Resolved",
        }),

        Ticket.countDocuments({
          status: "Closed",
        }),

        Ticket.countDocuments({
          priority: "Critical",
        }),

        Ticket.countDocuments({
          priority: "High",
        }),
      ]);

      res.json({
        summary: {
          total,
          open,
          inProgress,
          resolved,
          closed,
          critical,
          high,
        },
      });
    } catch (error) {
      console.error(
        "Ticket summary error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to generate ticket summary",
      });
    }
  }
);


export default router;