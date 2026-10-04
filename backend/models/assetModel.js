import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    assetType: {
      type: String,
      required: true,
      trim: true,
    },

    assetTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Assigned",
        "Maintenance",
        "Retired",
      ],
      default: "Available",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    purchaseDate: {
      type: Date,
      default: null,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;