import express from "express";

import KnowledgeBase from "../models/knowledgeBaseModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ============================================================
// GET ALL ARTICLES
// ============================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician",
    "Employee"
  ),
  async (req, res) => {
    try {
      const {
        search,
        category,
      } = req.query;

      const filter = {
        active: true,
      };

      if (category) {
        filter.category =
          category;
      }

      if (search) {
        filter.$text = {
          $search:
            search,
        };
      }

      const articles =
        await KnowledgeBase.find(
          filter
        )
          .populate(
            "createdBy",
            "name email role"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        articles,
      });
    } catch (error) {
      console.error(
        "Knowledge base error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load knowledge base",
      });
    }
  }
);


// ============================================================
// CREATE ARTICLE
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const {
        title,
        content,
        category,
        tags,
        solution,
      } = req.body;

      if (
        !title ||
        !title.trim()
      ) {
        return res.status(400).json({
          message:
            "Article title is required",
        });
      }

      if (
        !content ||
        !content.trim()
      ) {
        return res.status(400).json({
          message:
            "Article content is required",
        });
      }

      const article =
        await KnowledgeBase.create({
          title:
            title.trim(),

          content:
            content.trim(),

          category:
            category ||
            "Other",

          tags:
            Array.isArray(tags)
              ? tags
              : [],

          solution:
            solution?.trim() ||
            "",

          createdBy:
            req.user.userId,
        });

      res.status(201).json({
        message:
          "Knowledge article created successfully",
        article,
      });
    } catch (error) {
      console.error(
        "Create knowledge article error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to create knowledge article",
      });
    }
  }
);


// ============================================================
// GET SINGLE ARTICLE
// ============================================================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician",
    "Employee"
  ),
  async (req, res) => {
    try {
      const article =
        await KnowledgeBase.findOne({
          _id:
            req.params.id,
          active: true,
        }).populate(
          "createdBy",
          "name email role"
        );

      if (!article) {
        return res.status(404).json({
          message:
            "Knowledge article not found",
        });
      }

      article.views += 1;

      await article.save();

      res.json({
        article,
      });
    } catch (error) {
      console.error(
        "Get knowledge article error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load knowledge article",
      });
    }
  }
);


// ============================================================
// UPDATE ARTICLE
// ============================================================

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const article =
        await KnowledgeBase.findById(
          req.params.id
        );

      if (!article) {
        return res.status(404).json({
          message:
            "Knowledge article not found",
        });
      }

      const fields = [
        "title",
        "content",
        "category",
        "tags",
        "solution",
        "active",
      ];

      fields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            article[field] =
              req.body[field];
          }
        }
      );

      await article.save();

      res.json({
        message:
          "Knowledge article updated successfully",
        article,
      });
    } catch (error) {
      console.error(
        "Update knowledge article error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update knowledge article",
      });
    }
  }
);


// ============================================================
// DELETE ARTICLE
// SYSTEM ADMIN
// ============================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const article =
        await KnowledgeBase.findById(
          req.params.id
        );

      if (!article) {
        return res.status(404).json({
          message:
            "Knowledge article not found",
        });
      }

      await KnowledgeBase.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Knowledge article deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete knowledge article error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to delete knowledge article",
      });
    }
  }
);


// ============================================================
// MARK ARTICLE HELPFUL
// ============================================================

router.patch(
  "/:id/helpful",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician",
    "Employee"
  ),
  async (req, res) => {
    try {
      const article =
        await KnowledgeBase.findOne({
          _id:
            req.params.id,
          active: true,
        });

      if (!article) {
        return res.status(404).json({
          message:
            "Knowledge article not found",
        });
      }

      article.helpfulCount += 1;

      await article.save();

      res.json({
        message:
          "Thank you for your feedback",
        helpfulCount:
          article.helpfulCount,
      });
    } catch (error) {
      console.error(
        "Helpful article error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update article feedback",
      });
    }
  }
);


// ============================================================
// TECHNICIAN KNOWLEDGE SUGGESTIONS
// ============================================================

router.get(
  "/suggestions/:ticketId",
  authMiddleware,
  roleMiddleware(
    "Technician",
    "IT Manager",
    "System Admin"
  ),
  async (req, res) => {
    try {
      const Ticket =
        (
          await import(
            "../models/ticketModel.js"
          )
        ).default;

      const ticket =
        await Ticket.findById(
          req.params.ticketId
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      const searchText = [
        ticket.title,
        ticket.description,
        ticket.category,
      ]
        .filter(Boolean)
        .join(" ");

      let articles = [];

      if (searchText.trim()) {
        articles =
          await KnowledgeBase.find(
            {
              active: true,
              $text: {
                $search:
                  searchText,
              },
            },
            {
              score: {
                $meta:
                  "textScore",
              },
            }
          )
            .sort({
              score: {
                $meta:
                  "textScore",
              },
            })
            .limit(5);
      }

      if (
        articles.length ===
        0
      ) {
        articles =
          await KnowledgeBase.find({
            active: true,
            category:
              ticket.category ||
              "Other",
          })
            .sort({
              helpfulCount:
                -1,
            })
            .limit(5);
      }

      res.json({
        suggestions:
          articles,
      });
    } catch (error) {
      console.error(
        "Knowledge suggestions error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to generate knowledge suggestions",
      });
    }
  }
);


export default router;