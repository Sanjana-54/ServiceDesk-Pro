import express from "express";

import AssetLifecycle from "../models/assetLifecycleModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ============================================================
// GET LIFECYCLE INFORMATION
// ============================================================

router.get(
  "/:assetId",
  authMiddleware,
  roleMiddleware(
    "Asset Manager",
    "System Admin",
    "IT Manager",
    "Technician"
  ),
  async (req, res) => {
    try {
      const lifecycle =
        await AssetLifecycle.findOne({
          asset:
            req.params.assetId,
        })
          .populate(
            "assignedUser",
            "name email role department"
          )
          .populate(
            "lastUpdatedBy",
            "name email role"
          );

      if (!lifecycle) {
        return res.json({
          lifecycle: null,
        });
      }

      res.json({
        lifecycle,
      });
    } catch (error) {
      console.error(
        "Get asset lifecycle error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load asset lifecycle",
      });
    }
  }
);


// ============================================================
// CREATE / UPDATE LIFECYCLE
// ASSET MANAGER / ADMIN
// ============================================================

router.put(
  "/:assetId",
  authMiddleware,
  roleMiddleware(
    "Asset Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const {
        lifecycleStatus,
        warrantyStartDate,
        warrantyEndDate,
        vendor,
        purchaseCost,
        purchaseOrderNumber,
        location,
        assignedUser,
        notes,
      } = req.body;

      const allowedStatuses = [
        "Procured",
        "Available",
        "Assigned",
        "Under Repair",
        "Replaced",
        "Retired",
        "Disposed",
      ];

      if (
        lifecycleStatus &&
        !allowedStatuses.includes(
          lifecycleStatus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid lifecycle status",
        });
      }

      if (
        warrantyStartDate &&
        warrantyEndDate &&
        new Date(
          warrantyEndDate
        ) <
          new Date(
            warrantyStartDate
          )
      ) {
        return res.status(400).json({
          message:
            "Warranty end date cannot be before start date",
        });
      }

      if (assignedUser) {
        const user =
          await User.findById(
            assignedUser
          );

        if (!user) {
          return res.status(400).json({
            message:
              "Assigned user not found",
          });
        }
      }

      const lifecycle =
        await AssetLifecycle.findOneAndUpdate(
          {
            asset:
              req.params.assetId,
          },
          {
            asset:
              req.params.assetId,

            lifecycleStatus:
              lifecycleStatus ||
              "Procured",

            warrantyStartDate:
              warrantyStartDate ||
              null,

            warrantyEndDate:
              warrantyEndDate ||
              null,

            vendor:
              vendor || "",

            purchaseCost:
              Number(
                purchaseCost || 0
              ),

            purchaseOrderNumber:
              purchaseOrderNumber ||
              "",

            location:
              location || "",

            assignedUser:
              assignedUser ||
              null,

            notes:
              notes || "",

            lastUpdatedBy:
              req.user.userId,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        )
          .populate(
            "assignedUser",
            "name email role department"
          )
          .populate(
            "lastUpdatedBy",
            "name email role"
          );

      res.json({
        message:
          "Asset lifecycle updated successfully",
        lifecycle,
      });
    } catch (error) {
      console.error(
        "Update asset lifecycle error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update asset lifecycle",
      });
    }
  }
);


// ============================================================
// ASSIGN ASSET
// ============================================================

router.patch(
  "/:assetId/assign",
  authMiddleware,
  roleMiddleware(
    "Asset Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const {
        userId,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required",
        });
      }

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const lifecycle =
        await AssetLifecycle.findOneAndUpdate(
          {
            asset:
              req.params.assetId,
          },
          {
            asset:
              req.params.assetId,
            assignedUser:
              user._id,
            lifecycleStatus:
              "Assigned",
            lastUpdatedBy:
              req.user.userId,
          },
          {
            new: true,
            upsert: true,
          }
        )
          .populate(
            "assignedUser",
            "name email role department"
          );

      res.json({
        message:
          "Asset assigned successfully",
        lifecycle,
      });
    } catch (error) {
      console.error(
        "Assign asset error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to assign asset",
      });
    }
  }
);


// ============================================================
// UPDATE LIFECYCLE STATUS
// ============================================================

router.patch(
  "/:assetId/status",
  authMiddleware,
  roleMiddleware(
    "Asset Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const {
        lifecycleStatus,
      } = req.body;

      const allowedStatuses = [
        "Procured",
        "Available",
        "Assigned",
        "Under Repair",
        "Replaced",
        "Retired",
        "Disposed",
      ];

      if (
        !allowedStatuses.includes(
          lifecycleStatus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid lifecycle status",
        });
      }

      const lifecycle =
        await AssetLifecycle.findOneAndUpdate(
          {
            asset:
              req.params.assetId,
          },
          {
            lifecycleStatus,
            lastUpdatedBy:
              req.user.userId,
          },
          {
            new: true,
            upsert: true,
          }
        );

      res.json({
        message:
          "Lifecycle status updated successfully",
        lifecycle,
      });
    } catch (error) {
      console.error(
        "Lifecycle status error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update lifecycle status",
      });
    }
  }
);


// ============================================================
// WARRANTY STATUS
// ============================================================

router.get(
  "/:assetId/warranty",
  authMiddleware,
  roleMiddleware(
    "Asset Manager",
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const lifecycle =
        await AssetLifecycle.findOne({
          asset:
            req.params.assetId,
        });

      if (!lifecycle) {
        return res.json({
          warranty: {
            configured: false,
            active: false,
            expired: false,
          },
        });
      }

      const now =
        new Date();

      const start =
        lifecycle.warrantyStartDate;

      const end =
        lifecycle.warrantyEndDate;

      const active =
        start &&
        end &&
        now >= start &&
        now <= end;

      const expired =
        end &&
        now > end;

      res.json({
        warranty: {
          configured:
            Boolean(
              start || end
            ),
          startDate:
            start,
          endDate:
            end,
          active:
            Boolean(active),
          expired:
            Boolean(expired),
        },
      });
    } catch (error) {
      console.error(
        "Warranty error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to check warranty",
      });
    }
  }
);


export default router;