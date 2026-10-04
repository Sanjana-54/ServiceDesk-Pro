import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AssetManagerDashboard() {
  const navigate = useNavigate();

  const [assets] = useState([
    {
      id: "AST-001",
      name: "Dell Latitude 5440",
      category: "Laptop",
      assignedTo: "Unassigned",
      status: "Available",
    },
    {
      id: "AST-002",
      name: "HP ProDesk 400",
      category: "Desktop",
      assignedTo: "Unassigned",
      status: "Available",
    },
    {
      id: "AST-003",
      name: "Cisco Router",
      category: "Network",
      assignedTo: "IT Department",
      status: "Assigned",
    },
  ]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "Available"
  ).length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "Assigned"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Asset Manager Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track organizational assets
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user.name || "Asset Manager"}
              </p>

              <p className="text-xs text-gray-500">
                Asset Manager
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>
      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* STATISTICS */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Assets
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalAssets}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Available
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {availableAssets}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Assigned
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {assignedAssets}
            </p>
          </div>

        </div>


        {/* MANAGEMENT */}

        <div className="mb-8">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Asset Operations
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <button
              onClick={() =>
                navigate("/assets")
              }
              className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:border-indigo-300 hover:shadow-md"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                💻
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Asset Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add, view, update and manage organizational
                hardware and other assets.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-indigo-600">
                Manage Assets →
              </span>

            </button>


            <button
              onClick={() =>
                navigate("/asset-assignments")
              }
              className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:border-blue-300 hover:shadow-md"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                👤
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Asset Assignments
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Track which employees or departments are
                using organizational assets.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                View Assignments →
              </span>

            </button>

          </div>

        </div>


        {/* ASSET LIST */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="text-lg font-bold text-gray-900">
              Recent Assets
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Overview of currently tracked assets
            </p>

          </div>


          <div className="divide-y divide-gray-100">

            {assets.map((asset) => (

              <div
                key={asset.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >

                <div>

                  <h3 className="font-semibold text-gray-900">
                    {asset.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {asset.id} • {asset.category}
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <span className="text-sm text-gray-500">
                    {asset.assignedTo}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      asset.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {asset.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AssetManagerDashboard;