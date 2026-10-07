import mongoose from "mongoose";

const knowledgeBaseSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      content: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        enum: [
          "Hardware",
          "Software",
          "Network",
          "Access",
          "Other",
        ],
        default: "Other",
      },

      tags: {
        type: [String],
        default: [],
      },

      solution: {
        type: String,
        default: "",
        trim: true,
      },

      active: {
        type: Boolean,
        default: true,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      views: {
        type: Number,
        default: 0,
      },

      helpfulCount: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

knowledgeBaseSchema.index({
  title: "text",
  content: "text",
  solution: "text",
  tags: "text",
});

const KnowledgeBase =
  mongoose.model(
    "KnowledgeBase",
    knowledgeBaseSchema
  );

export default KnowledgeBase;