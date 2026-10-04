import mongoose from "mongoose";

const slaSchema = new mongoose.Schema(
  {
    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      required: true,
      unique: true,
    },

    responseTime: {
      type: Number,
      required: true,
    },

    resolutionTime: {
      type: Number,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SLA = mongoose.model(
  "SLA",
  slaSchema
);

export default SLA;