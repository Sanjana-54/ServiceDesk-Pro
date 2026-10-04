import express from "express";

import Category from "../models/categoryModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET ALL CATEGORIES

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
      const categories = await Category.find()
        .sort({ name: 1 });

      res.json({
        categories,
      });
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching categories",
      });
    }
  }
);


// CREATE CATEGORY

router.post(
  "/",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        description,
      } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({
          message:
            "Category name is required",
        });
      }

      const existing =
        await Category.findOne({
          name: name.trim(),
        });

      if (existing) {
        return res.status(400).json({
          message:
            "Category already exists",
        });
      }

      const category =
        await Category.create({
          name: name.trim(),
          description:
            description?.trim() || "",
        });

      res.status(201).json({
        message:
          "Category created successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating category",
      });
    }
  }
);


// UPDATE CATEGORY

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        active,
      } = req.body;

      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      if (name?.trim()) {
        const duplicate =
          await Category.findOne({
            name: name.trim(),
            _id: {
              $ne: req.params.id,
            },
          });

        if (duplicate) {
          return res.status(400).json({
            message:
              "Category already exists",
          });
        }

        category.name = name.trim();
      }

      if (description !== undefined) {
        category.description =
          description.trim();
      }

      if (active !== undefined) {
        category.active = active;
      }

      await category.save();

      res.json({
        message:
          "Category updated successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Update category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating category",
      });
    }
  }
);


// DELETE CATEGORY

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      await Category.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting category",
      });
    }
  }
);

export default router;