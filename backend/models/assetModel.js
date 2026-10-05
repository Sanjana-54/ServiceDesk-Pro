import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Laptop",
        "Desktop",
        "Monitor",
        "Printer",
        "Network Device",
        "Mobile",
        "Other",
      ],
      default: "Other",
    },

    serialNumber: {
      type: String,
      trim: true,
      default: "",
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

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Asset",
  assetSchema
);