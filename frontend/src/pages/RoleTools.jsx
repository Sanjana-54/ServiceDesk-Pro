import { useNavigate } from "react-router-dom";

export default function RoleTools({ role }) {
  const navigate = useNavigate();

  const tools = [];

  if (role === "System Admin") {
    tools.push(
      {
        title: "User Management",
        description: "Manage users, roles and account status.",
        path: "/admin/users",
        icon: "♙",
      },
      {
        title: "Ticket Management",
        description: "Review and manage service requests.",
        path: "/admin/tickets",
        icon: "▣",
      },
      {
        title: "SLA Monitoring",
        description: "Monitor SLA deadlines and risks.",
        path: "/sla-monitor",
        icon: "◷",
      },
      {
        title: "Reports",
        description: "Analyze support performance.",
        path: "/reports",
        icon: "▤",
      },
      {
        title: "Audit Logs",
        description: "Track important system activity.",
        path: "/audit-logs",
        icon: "◈",
      },
      {
        title: "Knowledge Base",
        description: "Manage troubleshooting articles.",
        path: "/knowledge/manage",
        icon: "?",
      }
    );
  }

  if (role === "IT Manager") {
    tools.push(
      {
        title: "Ticket Management",
        description: "Assign and prioritize tickets.",
        path: "/ticket-management",
        icon: "▣",
      },
      {
        title: "Technicians",
        description: "Manage technician workload.",
        path: "/technician-management",
        icon: "♙",
      },
      {
        title: "SLA Monitoring",
        description: "Monitor SLA performance.",
        path: "/sla-monitor",
        icon: "◷",
      },
      {
        title: "Reports",
        description: "Analyze support performance.",
        path: "/reports",
        icon: "▤",
      },
      {
        title: "Knowledge Base",
        description: "Manage support solutions.",
        path: "/knowledge/manage",
        icon: "?",
      }
    );
  }

  return (
    <section className="mt-8">

      <div className="mb-5">
        <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
          MANAGEMENT WORKSPACE
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#101b3d]">
          Management Tools
        </h2>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            No management tools available for this role.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {tools.map((tool) => (
            <button
              key={tool.path}
              onClick={() => navigate(tool.path)}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#ff9aaa] hover:shadow-md"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f3] text-lg font-bold text-[#ff5d73]">
                {tool.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#101b3d]">
                {tool.title}
              </h3>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                {tool.description}
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#ff5d73]">
                Open →
              </span>

            </button>
          ))}

        </div>
      )}

    </section>
  );
}