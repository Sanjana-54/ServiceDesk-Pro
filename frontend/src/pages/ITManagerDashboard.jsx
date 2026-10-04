import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ITManagerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    technicians: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/dashboard/admin"
      );

      setStats(response.data.stats || {});
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
    },
    {
      title: "Total Tickets",
      value: stats.totalTickets,
      icon: "🎫",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      icon: "📂",
    },
    {
      title: "Resolved Tickets",
      value: stats.resolvedTickets,
      icon: "✅",
    },
    {
      title: "Technicians",
      value: stats.technicians,
      icon: "🧑‍💻",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              IT Manager Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage IT operations and support
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {user.name || "IT Manager"}
              </p>

              <p className="text-xs text-gray-500">
                {user.role || "IT Manager"}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8">

          <h2 className="text-xl font-bold text-gray-900">
            Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your IT support operations.
          </p>

        </div>


        {loading ? (

          <div className="rounded-xl bg-white p-10 text-center">
            Loading dashboard...
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {cards.map((card) => (

              <div
                key={card.title}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >

                <div className="mb-4 text-3xl">
                  {card.icon}
                </div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>

              </div>

            ))}

          </div>

        )}


        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <button
            onClick={() =>
              navigate("/technician-management")
            }
            className="rounded-xl border bg-white p-6 text-left shadow-sm hover:border-indigo-400"
          >
            <div className="text-3xl">🧑‍💻</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Technician Management
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage technicians.
            </p>
          </button>


          <button
            onClick={() =>
              navigate("/ticket-management")
            }
            className="rounded-xl border bg-white p-6 text-left shadow-sm hover:border-indigo-400"
          >
            <div className="text-3xl">🎫</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Ticket Management
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Monitor and assign support tickets.
            </p>
          </button>


          <button
            onClick={() =>
              navigate("/assets")
            }
            className="rounded-xl border bg-white p-6 text-left shadow-sm hover:border-indigo-400"
          >
            <div className="text-3xl">💻</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Asset Management
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View organizational assets.
            </p>
          </button>

        </div>

      </main>

    </div>
  );
}

export default ITManagerDashboard;