import mongoose from "mongoose";

const slaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      required: true,
    },

    responseTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    resolutionTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    businessHoursStart: {
      type: String,
      default: "09:00",
    },

    businessHoursEnd: {
      type: String,
      default: "18:00",
    },

    businessDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5],
    },

    escalationEnabled: {
      type: Boolean,
      default: true,
    },

    escalationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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