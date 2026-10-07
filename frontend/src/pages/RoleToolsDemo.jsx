import { useNavigate } from "react-router-dom";

export default function RoleToolsDemo() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "SLA Monitoring",
      description:
        "Monitor response and resolution deadlines.",
      path: "/sla-monitor",
      roles: "Admin • IT Manager",
    },
    {
      title: "Support Reports",
      description:
        "Analyze ticket and technician performance.",
      path: "/reports",
      roles: "Admin • IT Manager",
    },
    {
      title: "Audit Logs",
      description:
        "Track important system activities.",
      path: "/audit-logs",
      roles: "System Admin",
    },
    {
      title: "Knowledge Base",
      description:
        "Search troubleshooting solutions.",
      path: "/knowledge",
      roles: "All support users",
    },
    {
      title: "Knowledge Management",
      description:
        "Create and maintain support articles.",
      path: "/knowledge/manage",
      roles: "Admin • IT Manager",
    },
    {
      title: "Ticket Management",
      description:
        "Assign technicians and update priorities.",
      path: "/ticket-management",
      roles: "Admin • IT Manager",
    },
    {
      title: "Technician Management",
      description:
        "Manage technician availability.",
      path: "/technician-management",
      roles: "Admin • IT Manager",
    },
    {
      title: "Asset Management",
      description:
        "Manage hardware and software assets.",
      path: "/assets",
      roles: "Asset Manager • Admin",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-[#101b3d]">
          ServiceDesk Pro
        </h1>

        <p className="mt-1 text-slate-500">
          System Management
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <button
              key={tool.path}
              onClick={() => navigate(tool.path)}
              className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-[#101b3d]">
                {tool.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {tool.description}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#ff6b5f]">
                {tool.roles}
              </p>

              <p className="mt-5 text-sm font-semibold text-[#101b3d]">
                Open →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}