import express from "express";

import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import SLA from "../models/slaModel.js";
import AuditLog from "../models/auditLogModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// ============================================================
// HELPER - CREATE AUDIT LOG
// ============================================================

const createAuditLog = async ({
  actor,
  action,
  entityType,
  entityId = null,
  details = {},
  ipAddress = "",
}) => {
  try {
    await AuditLog.create({
      actor,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error(
      "Audit log error:",
      error.message
    );
  }
};


// ============================================================
// HELPER - BUSINESS MINUTES
// ============================================================

const getMinutesFromTime = (
  timeString
) => {
  const [hours, minutes] =
    timeString.split(":").map(Number);

  return (
    hours * 60 +
    minutes
  );
};


const calculateBusinessMinutes = (
  startDate,
  endDate,
  sla
) => {
  if (!startDate || !endDate) {
    return 0;
  }

  if (endDate <= startDate) {
    return 0;
  }

  const startMinutes =
    getMinutesFromTime(
      sla.businessHoursStart || "09:00"
    );

  const endMinutes =
    getMinutesFromTime(
      sla.businessHoursEnd || "18:00"
    );

  let totalMinutes = 0;

  const current = new Date(
    startDate
  );

  current.setHours(0, 0, 0, 0);

  const finalDate = new Date(
    endDate
  );

  while (current <= finalDate) {
    const day =
      current.getDay();

    const isoDay =
      day === 0
        ? 7
        : day;

    if (
      sla.businessDays.includes(
        isoDay
      )
    ) {
      const businessStart =
        new Date(current);

      businessStart.setHours(
        Math.floor(startMinutes / 60),
        startMinutes % 60,
        0,
        0
      );

      const businessEnd =
        new Date(current);

      businessEnd.setHours(
        Math.floor(endMinutes / 60),
        endMinutes % 60,
        0,
        0
      );

      const effectiveStart =
        startDate > businessStart
          ? startDate
          : businessStart;

      const effectiveEnd =
        endDate < businessEnd
          ? endDate
          : businessEnd;

      if (
        effectiveEnd >
        effectiveStart
      ) {
        totalMinutes +=
          Math.floor(
            (
              effectiveEnd -
              effectiveStart
            ) / 60000
          );
      }
    }

    current.setDate(
      current.getDate() + 1
    );
  }

  return totalMinutes;
};


// ============================================================
// SYSTEM ADMIN DASHBOARD
// ============================================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const [
        totalUsers,
        activeUsers,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        totalTechnicians,
        assignedTickets,
      ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
          isActive: true,
        }),

        Ticket.countDocuments(),

        Ticket.countDocuments({
          status: "Open",
        }),

        Ticket.countDocuments({
          status: "In Progress",
        }),

        Ticket.countDocuments({
          status: "Resolved",
        }),

        Ticket.countDocuments({
          status: "Closed",
        }),

        User.countDocuments({
          role: "Technician",
          isActive: true,
        }),

        Ticket.countDocuments({
          assignedTo: {
            $ne: null,
          },
        }),
      ]);

      const technicians =
        await User.find({
          role: "Technician",
          isActive: true,
        }).select(
          "name email department"
        );

      const workload =
        await Promise.all(
          technicians.map(
            async (technician) => {
              const count =
                await Ticket.countDocuments({
                  assignedTo:
                    technician._id,
                  status: {
                    $in: [
                      "Open",
                      "In Progress",
                    ],
                  },
                });

              return {
                technician,
                activeTickets: count,
              };
            }
          )
        );

      res.json({
        stats: {
          totalUsers,
          activeUsers,
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          totalTechnicians,
          assignedTickets,
        },

        technicianWorkload:
          workload,
      });
    } catch (error) {
      console.error(
        "Management dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while loading dashboard",
      });
    }
  }
);


// ============================================================
// GET ALL USERS
// SYSTEM ADMIN
// ============================================================

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select(
            "-password"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        users,
      });
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching users",
      });
    }
  }
);


// ============================================================
// GET TECHNICIANS
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.get(
  "/technicians",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const technicians =
        await User.find({
          role: "Technician",
          isActive: true,
        }).select(
          "name email role department isActive"
        );

      res.json({
        technicians,
      });
    } catch (error) {
      console.error(
        "Fetch technicians error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching technicians",
      });
    }
  }
);


// ============================================================
// CHANGE USER ROLE
// SYSTEM ADMIN
// ============================================================

router.patch(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const { role } =
        req.body;

      const allowedRoles = [
        "System Admin",
        "IT Manager",
        "Technician",
        "Employee",
        "Asset Manager",
      ];

      if (
        !allowedRoles.includes(
          role
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user role",
        });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const oldRole =
        user.role;

      user.role = role;

      await user.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "USER_ROLE_CHANGED",
        entityType:
          "User",
        entityId:
          user._id,
        details: {
          oldRole,
          newRole: role,
          userEmail:
            user.email,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "User role updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department:
            user.department,
          isActive:
            user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Change role error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while changing user role",
      });
    }
  }
);


// ============================================================
// ACTIVATE / DEACTIVATE USER
// SYSTEM ADMIN
// ============================================================

router.patch(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        isActive,
      } = req.body;

      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          message:
            "isActive must be true or false",
        });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.isActive =
        isActive;

      await user.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          isActive
            ? "USER_ACTIVATED"
            : "USER_DEACTIVATED",
        entityType:
          "User",
        entityId:
          user._id,
        details: {
          email:
            user.email,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          isActive
            ? "User activated successfully"
            : "User deactivated successfully",
      });
    } catch (error) {
      console.error(
        "User status error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating user status",
      });
    }
  }
);


// ============================================================
// GET CATEGORIES
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.get(
  "/categories",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const categories =
        await Category.find()
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            name: 1,
          });

      res.json({
        categories,
      });
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching categories",
      });
    }
  }
);


// ============================================================
// CREATE CATEGORY
// SYSTEM ADMIN
// ============================================================

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        description,
      } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          message:
            "Category name is required",
        });
      }

      const existing =
        await Category.findOne({
          name: name.trim(),
        });

      if (existing) {
        return res.status(400).json({
          message:
            "Category already exists",
        });
      }

      const category =
        await Category.create({
          name: name.trim(),
          description:
            description?.trim() ||
            "",
          createdBy:
            req.user.userId,
        });

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "CATEGORY_CREATED",
        entityType:
          "Category",
        entityId:
          category._id,
        details: {
          name:
            category.name,
        },
        ipAddress:
          req.ip,
      });

      res.status(201).json({
        message:
          "Category created successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating category",
      });
    }
  }
);


// ============================================================
// UPDATE CATEGORY
// SYSTEM ADMIN
// ============================================================

router.patch(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        active,
      } = req.body;

      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message:
            "Category not found",
        });
      }

      if (
        name !== undefined &&
        name.trim()
      ) {
        category.name =
          name.trim();
      }

      if (
        description !==
        undefined
      ) {
        category.description =
          description.trim();
      }

      if (
        active !== undefined
      ) {
        category.active =
          active;
      }

      await category.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "CATEGORY_UPDATED",
        entityType:
          "Category",
        entityId:
          category._id,
        details: {
          name:
            category.name,
          active:
            category.active,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "Category updated successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Update category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating category",
      });
    }
  }
);


// ============================================================
// DELETE CATEGORY
// SYSTEM ADMIN
// ============================================================

router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message:
            "Category not found",
        });
      }

      await Category.findByIdAndDelete(
        req.params.id
      );

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "CATEGORY_DELETED",
        entityType:
          "Category",
        entityId:
          category._id,
        details: {
          name:
            category.name,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting category",
      });
    }
  }
);


// ============================================================
// GET SLA POLICIES
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.get(
  "/sla",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const policies =
        await SLA.find()
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            priority: 1,
          });

      res.json({
        policies,
      });
    } catch (error) {
      console.error(
        "Fetch SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching SLA policies",
      });
    }
  }
);


// ============================================================
// CREATE SLA POLICY
// SYSTEM ADMIN
// ============================================================

router.post(
  "/sla",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const {
        name,
        priority,
        responseTimeMinutes,
        resolutionTimeMinutes,
        businessHoursStart,
        businessHoursEnd,
        businessDays,
        escalationEnabled,
        escalationMinutes,
      } = req.body;

      if (
        !name ||
        !priority ||
        !responseTimeMinutes ||
        !resolutionTimeMinutes
      ) {
        return res.status(400).json({
          message:
            "Name, priority, response time and resolution time are required",
        });
      }

      const existing =
        await SLA.findOne({
          priority,
          active: true,
        });

      if (existing) {
        return res.status(400).json({
          message:
            "An active SLA already exists for this priority",
        });
      }

      const policy =
        await SLA.create({
          name:
            name.trim(),
          priority,
          responseTimeMinutes:
            Number(
              responseTimeMinutes
            ),
          resolutionTimeMinutes:
            Number(
              resolutionTimeMinutes
            ),
          businessHoursStart:
            businessHoursStart ||
            "09:00",
          businessHoursEnd:
            businessHoursEnd ||
            "18:00",
          businessDays:
            Array.isArray(
              businessDays
            )
              ? businessDays
              : [1, 2, 3, 4, 5],
          escalationEnabled:
            escalationEnabled !==
            undefined
              ? escalationEnabled
              : true,
          escalationMinutes:
            Number(
              escalationMinutes ||
                0
            ),
          createdBy:
            req.user.userId,
        });

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "SLA_CREATED",
        entityType:
          "SLA",
        entityId:
          policy._id,
        details: {
          name:
            policy.name,
          priority:
            policy.priority,
        },
        ipAddress:
          req.ip,
      });

      res.status(201).json({
        message:
          "SLA policy created successfully",
        policy,
      });
    } catch (error) {
      console.error(
        "Create SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating SLA",
      });
    }
  }
);


// ============================================================
// UPDATE SLA POLICY
// SYSTEM ADMIN
// ============================================================

router.patch(
  "/sla/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const policy =
        await SLA.findById(
          req.params.id
        );

      if (!policy) {
        return res.status(404).json({
          message:
            "SLA policy not found",
        });
      }

      const fields = [
        "name",
        "priority",
        "responseTimeMinutes",
        "resolutionTimeMinutes",
        "businessHoursStart",
        "businessHoursEnd",
        "businessDays",
        "escalationEnabled",
        "escalationMinutes",
        "active",
      ];

      fields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            policy[field] =
              req.body[field];
          }
        }
      );

      await policy.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "SLA_UPDATED",
        entityType:
          "SLA",
        entityId:
          policy._id,
        details: {
          name:
            policy.name,
          priority:
            policy.priority,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "SLA policy updated successfully",
        policy,
      });
    } catch (error) {
      console.error(
        "Update SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating SLA",
      });
    }
  }
);


// ============================================================
// DELETE SLA POLICY
// SYSTEM ADMIN
// ============================================================

router.delete(
  "/sla/:id",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const policy =
        await SLA.findById(
          req.params.id
        );

      if (!policy) {
        return res.status(404).json({
          message:
            "SLA policy not found",
        });
      }

      await SLA.findByIdAndDelete(
        req.params.id
      );

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "SLA_DELETED",
        entityType:
          "SLA",
        entityId:
          policy._id,
        details: {
          name:
            policy.name,
          priority:
            policy.priority,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "SLA policy deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting SLA",
      });
    }
  }
);


// ============================================================
// ASSIGN TECHNICIAN TO TICKET
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.patch(
  "/tickets/:id/assign",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const {
        technicianId,
      } = req.body;

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      if (!technicianId) {
        return res.status(400).json({
          message:
            "Technician ID is required",
        });
      }

      const technician =
        await User.findOne({
          _id: technicianId,
          role: "Technician",
          isActive: true,
        });

      if (!technician) {
        return res.status(400).json({
          message:
            "Selected technician is invalid or inactive",
        });
      }

      const oldTechnician =
        ticket.assignedTo;

      ticket.assignedTo =
        technician._id;

      if (
        ticket.status ===
        "Open"
      ) {
        ticket.status =
          "In Progress";
      }

      await ticket.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "TECHNICIAN_ASSIGNED",
        entityType:
          "Ticket",
        entityId:
          ticket._id,
        details: {
          previousTechnician:
            oldTechnician,
          newTechnician:
            technician._id,
          technicianName:
            technician.name,
        },
        ipAddress:
          req.ip,
      });

      const updatedTicket =
        await Ticket.findById(
          ticket._id
        )
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      res.json({
        message:
          "Technician assigned successfully",
        ticket:
          updatedTicket,
      });
    } catch (error) {
      console.error(
        "Assign technician error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while assigning technician",
      });
    }
  }
);


// ============================================================
// CHANGE TICKET PRIORITY
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.patch(
  "/tickets/:id/priority",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const {
        priority,
      } = req.body;

      const allowedPriorities = [
        "Low",
        "Medium",
        "High",
        "Critical",
      ];

      if (
        !allowedPriorities.includes(
          priority
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid priority",
        });
      }

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }

      const oldPriority =
        ticket.priority;

      ticket.priority =
        priority;

      await ticket.save();

      await createAuditLog({
        actor:
          req.user.userId,
        action:
          "TICKET_PRIORITY_CHANGED",
        entityType:
          "Ticket",
        entityId:
          ticket._id,
        details: {
          oldPriority,
          newPriority:
            priority,
        },
        ipAddress:
          req.ip,
      });

      res.json({
        message:
          "Ticket priority updated successfully",
        ticket,
      });
    } catch (error) {
      console.error(
        "Priority update error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating priority",
      });
    }
  }
);


// ============================================================
// SLA OVERVIEW
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.get(
  "/sla/overview",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const [
        tickets,
        policies,
      ] = await Promise.all([
        Ticket.find({
          status: {
            $nin: [
              "Closed",
            ],
          },
        })
          .populate(
            "assignedTo",
            "name email"
          )
          .populate(
            "createdBy",
            "name email"
          ),

        SLA.find({
          active: true,
        }),
      ]);

      const now =
        new Date();

      const result =
        tickets.map(
          (ticket) => {
            const policy =
              policies.find(
                (item) =>
                  item.priority ===
                  ticket.priority
              );

            if (!policy) {
              return {
                ticketId:
                  ticket._id,
                title:
                  ticket.title,
                priority:
                  ticket.priority,
                status:
                  ticket.status,
                assignedTo:
                  ticket.assignedTo,
                slaConfigured:
                  false,
                breached:
                  false,
                remainingMinutes:
                  null,
              };
            }

            const elapsed =
              calculateBusinessMinutes(
                ticket.createdAt,
                now,
                policy
              );

            const remaining =
              policy.resolutionTimeMinutes -
              elapsed;

            return {
              ticketId:
                ticket._id,
              title:
                ticket.title,
              priority:
                ticket.priority,
              status:
                ticket.status,
              assignedTo:
                ticket.assignedTo,
              createdBy:
                ticket.createdBy,
              slaConfigured:
                true,
              breached:
                remaining <= 0,
              remainingMinutes:
                Math.max(
                  0,
                  remaining
                ),
              resolutionLimitMinutes:
                policy.resolutionTimeMinutes,
              escalationEnabled:
                policy.escalationEnabled,
            };
          }
        );

      const breached =
        result.filter(
          (item) =>
            item.breached
        );

      res.json({
        tickets: result,
        summary: {
          total:
            result.length,
          breached:
            breached.length,
          withinSLA:
            result.length -
            breached.length,
        },
      });
    } catch (error) {
      console.error(
        "SLA overview error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while loading SLA overview",
      });
    }
  }
);


// ============================================================
// PERFORMANCE REPORT
// SYSTEM ADMIN + IT MANAGER
// ============================================================

router.get(
  "/performance",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager"
  ),
  async (req, res) => {
    try {
      const technicians =
        await User.find({
          role: "Technician",
          isActive: true,
        }).select(
          "name email department"
        );

      const performance =
        await Promise.all(
          technicians.map(
            async (technician) => {
              const [
                assigned,
                active,
                resolved,
              ] =
                await Promise.all([
                  Ticket.countDocuments({
                    assignedTo:
                      technician._id,
                  }),

                  Ticket.countDocuments({
                    assignedTo:
                      technician._id,
                    status: {
                      $in: [
                        "Open",
                        "In Progress",
                      ],
                    },
                  }),

                  Ticket.find({
                    assignedTo:
                      technician._id,
                    status: {
                      $in: [
                        "Resolved",
                        "Closed",
                      ],
                    },
                  }).select(
                    "createdAt updatedAt"
                  ),
                ]);

              let averageResolutionMinutes =
                0;

              if (
                resolved.length >
                0
              ) {
                const totalMinutes =
                  resolved.reduce(
                    (
                      total,
                      ticket
                    ) => {
                      return (
                        total +
                        Math.max(
                          0,
                          Math.floor(
                            (
                              ticket.updatedAt -
                              ticket.createdAt
                            ) /
                              60000
                          )
                        )
                      );
                    },
                    0
                  );

                averageResolutionMinutes =
                  Math.round(
                    totalMinutes /
                      resolved.length
                  );
              }

              return {
                technician,
                assignedTickets:
                  assigned,
                activeTickets:
                  active,
                resolvedTickets:
                  resolved.length,
                averageResolutionMinutes,
              };
            }
          )
        );

      res.json({
        performance,
      });
    } catch (error) {
      console.error(
        "Performance report error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while generating performance report",
      });
    }
  }
);


// ============================================================
// AUDIT LOGS
// SYSTEM ADMIN
// ============================================================

router.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware("System Admin"),
  async (req, res) => {
    try {
      const logs =
        await AuditLog.find()
          .populate(
            "actor",
            "name email role"
          )
          .sort({
            createdAt: -1,
          })
          .limit(200);

      res.json({
        logs,
      });
    } catch (error) {
      console.error(
        "Audit logs error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while loading audit logs",
      });
    }
  }
);


export default router;