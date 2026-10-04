import express from "express";

import SLA from "../models/slaModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET SLA RULES

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const slas = await SLA.find()
        .sort({ responseTime: 1 });

      res.json({
        slas,
      });
    } catch (error) {
      console.error(
        "Fetch SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching SLA rules",
      });
    }
  }
);


// CREATE SLA

router.post(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        priority,
        responseTime,
        resolutionTime,
      } = req.body;

      if (
        !priority ||
        !responseTime ||
        !resolutionTime
      ) {
        return res.status(400).json({
          message:
            "Priority, response time and resolution time are required",
        });
      }

      const existing =
        await SLA.findOne({
          priority,
        });

      if (existing) {
        return res.status(400).json({
          message:
            "SLA already exists for this priority",
        });
      }

      const sla = await SLA.create({
        priority,
        responseTime,
        resolutionTime,
      });

      res.status(201).json({
        message:
          "SLA created successfully",
        sla,
      });
    } catch (error) {
      console.error(
        "Create SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating SLA",
      });
    }
  }
);


// UPDATE SLA

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        priority,
        responseTime,
        resolutionTime,
        active,
      } = req.body;

      const sla =
        await SLA.findById(
          req.params.id
        );

      if (!sla) {
        return res.status(404).json({
          message: "SLA not found",
        });
      }

      if (priority) {
        sla.priority = priority;
      }

      if (responseTime !== undefined) {
        sla.responseTime =
          responseTime;
      }

      if (resolutionTime !== undefined) {
        sla.resolutionTime =
          resolutionTime;
      }

      if (active !== undefined) {
        sla.active = active;
      }

      await sla.save();

      res.json({
        message:
          "SLA updated successfully",
        sla,
      });
    } catch (error) {
      console.error(
        "Update SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating SLA",
      });
    }
  }
);


// DELETE SLA

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const sla =
        await SLA.findById(
          req.params.id
        );

      if (!sla) {
        return res.status(404).json({
          message: "SLA not found",
        });
      }

      await SLA.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "SLA deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting SLA",
      });
    }
  }
);

export default router;