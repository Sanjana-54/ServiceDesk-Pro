import mongoose from "mongoose";

const assetLifecycleSchema =
  new mongoose.Schema(
    {
      asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true,
        unique: true,
      },

      lifecycleStatus: {
        type: String,
        enum: [
          "Procured",
          "Available",
          "Assigned",
          "Under Repair",
          "Replaced",
          "Retired",
          "Disposed",
        ],
        default: "Procured",
      },

      warrantyStartDate: {
        type: Date,
        default: null,
      },

      warrantyEndDate: {
        type: Date,
        default: null,
      },

      vendor: {
        type: String,
        default: "",
        trim: true,
      },

      purchaseCost: {
        type: Number,
        default: 0,
        min: 0,
      },

      purchaseOrderNumber: {
        type: String,
        default: "",
        trim: true,
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
      },

      lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const AssetLifecycle =
  mongoose.model(
    "AssetLifecycle",
    assetLifecycleSchema
  );

export default AssetLifecycle;