import express from "express";

import AuditLog from "../models/auditLogModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const limit =
        Math.min(
          Number(
            req.query.limit || 100
          ),
          500
        );

      const logs =
        await AuditLog.find()
          .populate(
            "actor",
            "name email role"
          )
          .sort({
            createdAt: -1,
          })
          .limit(limit);

      res.json({
        logs,
      });
    } catch (error) {
      console.error(
        "Audit logs error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load audit logs",
      });
    }
  }
);

router.get(
  "/entity/:entityType/:entityId",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const logs =
        await AuditLog.find({
          entityType:
            req.params.entityType,
          entityId:
            req.params.entityId,
        })
          .populate(
            "actor",
            "name email role"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        logs,
      });
    } catch (error) {
      console.error(
        "Entity audit logs error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load entity audit logs",
      });
    }
  }
);

export default router;