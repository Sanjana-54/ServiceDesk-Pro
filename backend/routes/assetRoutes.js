import express from "express";

import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// =====================================================
// GET ALL ASSETS
// =====================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      const assets = await Asset.find()
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });

      res.json({
        assets,
      });
    } catch (error) {
      console.error("Fetch assets error:", error);

      res.status(500).json({
        message: "Server error while fetching assets",
      });
    }
  }
);


// =====================================================
// CREATE ASSET
// =====================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      console.log("CREATE ASSET BODY:", req.body);

      /*
        Frontend sends:

        {
          assetTag,
          name,
          type,
          serialNumber,
          purchaseDate,
          description
        }

        Older backend used:

        category
        notes

        So we accept BOTH formats.
      */

      const {
        assetTag,
        name,
        type,
        category,
        serialNumber,
        purchaseDate,
        description,
        notes,
      } = req.body;


      // Use either frontend or older field names
      const finalType = type || category;
      const finalDescription = description || notes || "";


      // Required fields
      if (
        !assetTag ||
        !assetTag.toString().trim() ||
        !name ||
        !name.toString().trim() ||
        !finalType ||
        !finalType.toString().trim()
      ) {
        return res.status(400).json({
          message: "Asset name, type and asset tag are required",
        });
      }


      const cleanAssetTag = assetTag.toString().trim();
      const cleanName = name.toString().trim();
      const cleanType = finalType.toString().trim();


      // Check duplicate asset tag
      const existingAsset = await Asset.findOne({
        assetTag: cleanAssetTag,
      });

      if (existingAsset) {
        return res.status(400).json({
          message: "An asset with this asset tag already exists",
        });
      }


      // Create asset
      const asset = await Asset.create({
        assetTag: cleanAssetTag,

        name: cleanName,

        // Store frontend "type" inside the existing
        // database "category" field
        category: cleanType,

        serialNumber:
          serialNumber?.toString().trim() || "",

        purchaseDate:
          purchaseDate || null,

        // Store frontend "description" inside
        // the existing database "notes" field
        notes: finalDescription.toString().trim(),

        status: "Available",

        assignedTo: null,
      });


      res.status(201).json({
        message: "Asset created successfully",
        asset,
      });

    } catch (error) {
      console.error("Create asset error:", error);

      res.status(500).json({
        message:
          error.message || "Server error while creating asset",
      });
    }
  }
);


// =====================================================
// GET EMPLOYEES
// =====================================================

router.get(
  "/employees",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      const employees = await User.find({
        role: "Employee",
      }).select("_id name email role");

      res.json({
        employees,
      });

    } catch (error) {
      console.error("Fetch employees error:", error);

      res.status(500).json({
        message: "Server error while fetching employees",
      });
    }
  }
);


// =====================================================
// ASSIGN / UNASSIGN ASSET
// =====================================================

router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      const { userId } = req.body;

      const asset = await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }


      // =========================
      // UNASSIGN
      // =========================

      if (!userId) {
        asset.assignedTo = null;
        asset.status = "Available";

        await asset.save();

        const updatedAsset = await Asset.findById(asset._id)
          .populate("assignedTo", "name email role");

        return res.json({
          message: "Asset unassigned successfully",
          asset: updatedAsset,
        });
      }


      // =========================
      // CHECK EMPLOYEE
      // =========================

      const user = await User.findOne({
        _id: userId,
        role: "Employee",
      });

      if (!user) {
        return res.status(400).json({
          message: "Selected user is not an employee",
        });
      }


      // =========================
      // ASSIGN
      // =========================

      asset.assignedTo = user._id;
      asset.status = "Assigned";

      await asset.save();

      const updatedAsset = await Asset.findById(asset._id)
        .populate("assignedTo", "name email role");

      res.json({
        message: "Asset assigned successfully",
        asset: updatedAsset,
      });

    } catch (error) {
      console.error("Assign asset error:", error);

      res.status(500).json({
        message: "Server error while assigning asset",
      });
    }
  }
);


// =====================================================
// UPDATE ASSET
// =====================================================

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        type,
        category,
        serialNumber,
        status,
        purchaseDate,
        description,
        notes,
      } = req.body;


      const asset = await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }


      // Accept both type and category
      const finalType = type || category;

      if (finalType !== undefined) {
        const allowedTypes = [
          "Laptop",
          "Desktop",
          "Monitor",
          "Keyboard",
          "Mouse",
          "Printer",
          "Phone",
          "Network Device",
          "Mobile",
          "Other",
        ];

        if (!allowedTypes.includes(finalType)) {
          return res.status(400).json({
            message: "Invalid asset type",
          });
        }

        asset.category = finalType;
      }


      // Name
      if (name !== undefined) {
        asset.name = name;
      }


      // Serial number
      if (serialNumber !== undefined) {
        asset.serialNumber = serialNumber;
      }


      // Status
      if (status !== undefined) {
        const allowedStatuses = [
          "Available",
          "Assigned",
          "Maintenance",
          "Retired",
        ];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            message: "Invalid asset status",
          });
        }

        asset.status = status;
      }


      // Purchase date
      if (purchaseDate !== undefined) {
        asset.purchaseDate = purchaseDate;
      }


      // Description / notes
      if (description !== undefined) {
        asset.notes = description;
      } else if (notes !== undefined) {
        asset.notes = notes;
      }


      await asset.save();


      const updatedAsset = await Asset.findById(asset._id)
        .populate("assignedTo", "name email role");


      res.json({
        message: "Asset updated successfully",
        asset: updatedAsset,
      });

    } catch (error) {
      console.error("Update asset error:", error);

      res.status(500).json({
        message:
          error.message || "Server error while updating asset",
      });
    }
  }
);


// =====================================================
// DELETE ASSET
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Asset Manager", "System Admin"),
  async (req, res) => {
    try {
      const asset = await Asset.findById(req.params.id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }


      await Asset.findByIdAndDelete(req.params.id);


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