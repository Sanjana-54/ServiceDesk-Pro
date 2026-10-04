import express from "express";

import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ========================================
// GET ALL DEPARTMENTS
// SYSTEM ADMIN + IT MANAGER
// ========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const departments = await Department.find()
        .populate(
          "manager",
          "name email role"
        )
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
      const {
        name,
        description,
        manager,
      } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({
          message: "Department name is required",
        });
      }

      const existingDepartment =
        await Department.findOne({
          name: name.trim(),
        });

      if (existingDepartment) {
        return res.status(400).json({
          message:
            "Department already exists",
        });
      }

      let managerUser = null;

      if (manager) {
        managerUser = await User.findOne({
          _id: manager,
          role: "IT Manager",
        });

        if (!managerUser) {
          return res.status(400).json({
            message:
              "Selected manager must be an IT Manager",
          });
        }
      }

      const department =
        await Department.create({
          name: name.trim(),
          description:
            description?.trim() || "",
          manager: managerUser
            ? managerUser._id
            : null,
        });

      const populatedDepartment =
        await Department.findById(
          department._id
        ).populate(
          "manager",
          "name email role"
        );

      res.status(201).json({
        message:
          "Department created successfully",
        department:
          populatedDepartment,
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
      const {
        name,
        description,
        manager,
      } = req.body;

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

      if (name?.trim()) {
        const duplicate =
          await Department.findOne({
            name: name.trim(),
            _id: {
              $ne: req.params.id,
            },
          });

        if (duplicate) {
          return res.status(400).json({
            message:
              "Department already exists",
          });
        }

        department.name =
          name.trim();
      }

      if (description !== undefined) {
        department.description =
          description.trim();
      }

      if (manager !== undefined) {
        if (!manager) {
          department.manager = null;
        } else {
          const managerUser =
            await User.findOne({
              _id: manager,
              role: "IT Manager",
            });

          if (!managerUser) {
            return res.status(400).json({
              message:
                "Selected manager must be an IT Manager",
            });
          }

          department.manager =
            managerUser._id;
        }
      }

      await department.save();

      const updatedDepartment =
        await Department.findById(
          department._id
        ).populate(
          "manager",
          "name email role"
        );

      res.json({
        message:
          "Department updated successfully",
        department:
          updatedDepartment,
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