import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import AssetLifecycle from "../models/assetLifecycleModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/system-admin",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const [
        users,
        technicians,
        tickets,
        openTickets,
        resolvedTickets,
        assets,
      ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
          role: "Technician",
          isActive: true,
        }),

        Ticket.countDocuments(),

        Ticket.countDocuments({
          status: {
            $in: [
              "Open",
              "In Progress",
            ],
          },
        }),

        Ticket.countDocuments({
          status: {
            $in: [
              "Resolved",
              "Closed",
            ],
          },
        }),

        AssetLifecycle.countDocuments(),
      ]);

      res.json({
        stats: {
          users,
          technicians,
          tickets,
          openTickets,
          resolvedTickets,
          assets,
        },
      });
    } catch (error) {
      console.error(
        "System admin dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load system admin dashboard",
      });
    }
  }
);

router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("IT Manager"),
  async (req, res) => {
    try {
      const [
        technicians,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        unassignedTickets,
      ] = await Promise.all([
        User.countDocuments({
          role: "Technician",
          isActive: true,
        }),

        Ticket.countDocuments(),

        Ticket.countDocuments({
          status: "Open",
        }),

        Ticket.countDocuments({
          status: "In Progress",
        }),

        Ticket.countDocuments({
          status: {
            $in: [
              "Resolved",
              "Closed",
            ],
          },
        }),

        Ticket.countDocuments({
          assignedTo: null,
          status: {
            $nin: [
              "Closed",
            ],
          },
        }),
      ]);

      const technicianList =
        await User.find({
          role: "Technician",
          isActive: true,
        }).select(
          "name email department"
        );

      const workload =
        await Promise.all(
          technicianList.map(
            async (technician) => {
              const activeTickets =
                await Ticket.countDocuments({
                  assignedTo:
                    technician._id,
                  status: {
                    $in: [
                      "Open",
                      "In Progress",
                    ],
                  },
                });

              return {
                technician,
                activeTickets,
              };
            }
          )
        );

      res.json({
        stats: {
          technicians,
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          unassignedTickets,
        },
        workload,
      });
    } catch (error) {
      console.error(
        "Manager dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load manager dashboard",
      });
    }
  }
);

router.get(
  "/asset-manager",
  authMiddleware,
  roleMiddleware("Asset Manager"),
  async (req, res) => {
    try {
      const [
        totalAssets,
        assignedAssets,
        availableAssets,
        repairAssets,
        retiredAssets,
      ] = await Promise.all([
        AssetLifecycle.countDocuments(),

        AssetLifecycle.countDocuments({
          lifecycleStatus:
            "Assigned",
        }),

        AssetLifecycle.countDocuments({
          lifecycleStatus:
            "Available",
        }),

        AssetLifecycle.countDocuments({
          lifecycleStatus:
            "Under Repair",
        }),

        AssetLifecycle.countDocuments({
          lifecycleStatus:
            "Retired",
        }),
      ]);

      res.json({
        stats: {
          totalAssets,
          assignedAssets,
          availableAssets,
          repairAssets,
          retiredAssets,
        },
      });
    } catch (error) {
      console.error(
        "Asset manager dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load asset manager dashboard",
      });
    }
  }
);

export default router;