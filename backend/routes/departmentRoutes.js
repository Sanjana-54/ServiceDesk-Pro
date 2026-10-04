import express from "express";

import Department from "../models/departmentModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ========================================
// GET ALL DEPARTMENTS
// SYSTEM ADMIN ONLY
// ========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const departments = await Department.find()
        .sort({ createdAt: -1 });

      res.json({
        departments,
      });
    } catch (error) {
      console.error(
        "Fetch departments error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching departments",
      });
    }
  }
);


// ========================================
// CREATE DEPARTMENT
// SYSTEM ADMIN ONLY
// ========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Department name is required",
        });
      }

      const existingDepartment =
        await Department.findOne({ name });

      if (existingDepartment) {
        return res.status(400).json({
          message:
            "Department already exists",
        });
      }

      const department =
        await Department.create({
          name,
          description,
        });

      res.status(201).json({
        message:
          "Department created successfully",

        department,
      });
    } catch (error) {
      console.error(
        "Create department error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating department",
      });
    }
  }
);


// ========================================
// UPDATE DEPARTMENT
// SYSTEM ADMIN ONLY
// ========================================

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const { name, description } =
        req.body;

      const department =
        await Department.findById(
          req.params.id
        );

      if (!department) {
        return res.status(404).json({
          message:
            "Department not found",
        });
      }

      if (name) {
        department.name = name;
      }

      if (description !== undefined) {
        department.description =
          description;
      }

      await department.save();

      res.json({
        message:
          "Department updated successfully",

        department,
      });
    } catch (error) {
      console.error(
        "Update department error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating department",
      });
    }
  }
);


// ========================================
// DELETE DEPARTMENT
// SYSTEM ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const department =
        await Department.findById(
          req.params.id
        );

      if (!department) {
        return res.status(404).json({
          message:
            "Department not found",
        });
      }

      await Department.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Department deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete department error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting department",
      });
    }
  }
);


export default router;