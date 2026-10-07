import express from "express";

import Ticket from "../models/ticketModel.js";
import SLA from "../models/slaModel.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

const getBusinessMinutes = (
  start,
  end,
  policy
) => {
  if (!start || !end) {
    return 0;
  }

  const businessStart =
    policy.businessHoursStart ||
    "09:00";

  const businessEnd =
    policy.businessHoursEnd ||
    "18:00";

  const [
    startHour,
    startMinute,
  ] = businessStart
    .split(":")
    .map(Number);

  const [
    endHour,
    endMinute,
  ] = businessEnd
    .split(":")
    .map(Number);

  const allowedDays =
    policy.businessDays ||
    [1, 2, 3, 4, 5];

  let total = 0;

  const current =
    new Date(start);

  current.setHours(
    0,
    0,
    0,
    0
  );

  const final =
    new Date(end);

  while (
    current <= final
  ) {
    const day =
      current.getDay() === 0
        ? 7
        : current.getDay();

    if (
      allowedDays.includes(day)
    ) {
      const dayStart =
        new Date(current);

      dayStart.setHours(
        startHour,
        startMinute,
        0,
        0
      );

      const dayEnd =
        new Date(current);

      dayEnd.setHours(
        endHour,
        endMinute,
        0,
        0
      );

      const effectiveStart =
        start > dayStart
          ? start
          : dayStart;

      const effectiveEnd =
        end < dayEnd
          ? end
          : dayEnd;

      if (
        effectiveEnd >
        effectiveStart
      ) {
        total += Math.floor(
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

  return total;
};


router.get(
  "/status",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician"
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

      const results =
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
                configured:
                  false,
                breached:
                  false,
                remainingMinutes:
                  null,
              };
            }

            const elapsed =
              getBusinessMinutes(
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
              configured:
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
              percentageUsed:
                Math.min(
                  100,
                  Math.round(
                    (
                      elapsed /
                      policy.resolutionTimeMinutes
                    ) * 100
                  )
                ),
            };
          }
        );

      const breached =
        results.filter(
          (item) =>
            item.breached
        ).length;

      res.json({
        summary: {
          total:
            results.length,
          breached,
          withinSLA:
            results.length -
            breached,
        },
        tickets:
          results,
      });
    } catch (error) {
      console.error(
        "SLA status error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load SLA status",
      });
    }
  }
);


router.get(
  "/ticket/:ticketId",
  authMiddleware,
  roleMiddleware(
    "System Admin",
    "IT Manager",
    "Technician"
  ),
  async (req, res) => {
    try {
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

      const policy =
        await SLA.findOne({
          priority:
            ticket.priority,
          active: true,
        });

      if (!policy) {
        return res.json({
          configured:
            false,
          ticketId:
            ticket._id,
        });
      }

      const elapsed =
        getBusinessMinutes(
          ticket.createdAt,
          new Date(),
          policy
        );

      const remaining =
        policy.resolutionTimeMinutes -
        elapsed;

      res.json({
        configured:
          true,

        ticketId:
          ticket._id,

        priority:
          ticket.priority,

        status:
          ticket.status,

        elapsedMinutes:
          elapsed,

        remainingMinutes:
          Math.max(
            0,
            remaining
          ),

        breached:
          remaining <= 0,

        percentageUsed:
          Math.min(
            100,
            Math.round(
              (
                elapsed /
                policy.resolutionTimeMinutes
              ) * 100
            )
          ),

        escalationEnabled:
          policy.escalationEnabled,

        escalationMinutes:
          policy.escalationMinutes,
      });
    } catch (error) {
      console.error(
        "Ticket SLA error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to calculate ticket SLA",
      });
    }
  }
);


export default router;