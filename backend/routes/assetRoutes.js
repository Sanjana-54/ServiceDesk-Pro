import express from "express";

import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

const assetManagers = [
  "Asset Manager",
  "System Admin",
];


// GET ALL ASSETS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const assets = await Asset.find()
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({ createdAt: -1 });

      res.json({ assets });
    } catch (error) {
      console.error("Fetch assets error:", error);

      res.status(500).json({
        message: "Server error while fetching assets",
      });
    }
  }
);


// GET USERS FOR ASSIGNMENT
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const users = await User.find({
        role: {
          $in: [
            "Employee",
            "Technician",
            "IT Manager",
            "Asset Manager",
          ],
        },
      }).select("_id name email role");

      res.json({ users });
    } catch (error) {
      console.error("Fetch asset users error:", error);

      res.status(500).json({
        message: "Server error while fetching users",
      });
    }
  }
);


// CREATE ASSET
router.post(
  "/",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const {
        assetName,
        assetType,
        assetTag,
        serialNumber,
        purchaseDate,
        description,
      } = req.body;

      if (
        !assetName ||
        !assetType ||
        !assetTag
      ) {
        return res.status(400).json({
          message:
            "Asset name, type and asset tag are required",
        });
      }

      const existingAsset =
        await Asset.findOne({ assetTag });

      if (existingAsset) {
        return res.status(400).json({
          message: "Asset tag already exists",
        });
      }

      const asset = await Asset.create({
        assetName,
        assetType,
        assetTag,
        serialNumber,
        purchaseDate,
        description,
      });

      res.status(201).json({
        message: "Asset created successfully",
        asset,
      });
    } catch (error) {
      console.error("Create asset error:", error);

      res.status(500).json({
        message: "Server error while creating asset",
      });
    }
  }
);


// UPDATE ASSET
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const asset =
        await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }

      const allowedFields = [
        "assetName",
        "assetType",
        "assetTag",
        "serialNumber",
        "status",
        "purchaseDate",
        "description",
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          asset[field] = req.body[field];
        }
      });

      await asset.save();

      const updatedAsset =
        await Asset.findById(asset._id).populate(
          "assignedTo",
          "name email role"
        );

      res.json({
        message: "Asset updated successfully",
        asset: updatedAsset,
      });
    } catch (error) {
      console.error("Update asset error:", error);

      res.status(500).json({
        message: "Server error while updating asset",
      });
    }
  }
);


// ASSIGN ASSET
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const { userId } = req.body;

      const asset =
        await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }

      if (!userId) {
        asset.assignedTo = null;
        asset.status = "Available";
      } else {
        const user =
          await User.findById(userId);

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        asset.assignedTo = user._id;
        asset.status = "Assigned";
      }

      await asset.save();

      const updatedAsset =
        await Asset.findById(asset._id).populate(
          "assignedTo",
          "name email role"
        );

      res.json({
        message: userId
          ? "Asset assigned successfully"
          : "Asset returned successfully",
        asset: updatedAsset,
      });
    } catch (error) {
      console.error(
        "Assign asset error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while assigning asset",
      });
    }
  }
);


// DELETE ASSET
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(...assetManagers),
  async (req, res) => {
    try {
      const asset =
        await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }

      await Asset.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Asset deleted successfully",
      });
    } catch (error) {
      console.error("Delete asset error:", error);

      res.status(500).json({
        message: "Server error while deleting asset",
      });
    }
  }
);

export default router;