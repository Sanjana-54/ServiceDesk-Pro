import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    timeSpent: {
      type: Number,
      required: true,
      min: 1,
    },

    workDescription: {
      type: String,
      required: true,
      trim: true,
    },

    workType: {
      type: String,
      enum: [
        "Diagnosis",
        "Repair",
        "Installation",
        "Configuration",
        "Troubleshooting",
        "Other",
      ],
      default: "Other",
    },

    internalNote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WorkLog = mongoose.model(
  "WorkLog",
  workLogSchema
);

export default WorkLog;