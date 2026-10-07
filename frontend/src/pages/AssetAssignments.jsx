import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AssetAssignments() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assetsResponse, employeesResponse] =
        await Promise.all([
          api.get("/assets"),
          api.get("/assets/employees"),
        ]);

      setAssets(assetsResponse.data?.assets || []);
      setEmployees(
        employeesResponse.data?.employees || []
      );
    } catch (error) {
      console.error("Assignment page error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load assignment information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignAsset = async (assetId, userId) => {
    try {
      setError("");
      setMessage("");

      await api.patch(`/assets/${assetId}/assign`, {
        userId: userId || null,
      });

      setMessage(
        userId
          ? "Asset assigned successfully."
          : "Asset returned successfully."
      );

      await loadData();
    } catch (error) {
      console.error("Assignment error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update asset assignment."
      );
    }
  };

  const assignedAssets = assets.filter(
    (asset) =>
      asset.status === "Assigned" ||
      asset.assignedTo
  );

  const availableAssets = assets.filter(
    (asset) =>
      asset.status === "Available" &&
      !asset.assignedTo
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
              Asset Management
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Asset Assignments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage which employees are using company assets.
            </p>
          </div>

          <button
            onClick={() => navigate("/asset-manager")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-8">

        {/* MESSAGES */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* HERO */}

        <section className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#37306b] to-[#ff5d73] p-7 text-white shadow-lg">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Assignment Center
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Manage employee assignments
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Assign company assets to employees, return assets,
            and keep track of who currently has each asset.
          </p>

        </section>

        {/* STATS */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <StatCard
            title="Total Assets"
            value={assets.length}
            icon="▣"
            iconClass="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Assigned"
            value={assignedAssets.length}
            icon="♙"
            iconClass="bg-indigo-50 text-indigo-700"
          />

          <StatCard
            title="Available"
            value={availableAssets.length}
            icon="✓"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </section>

        {/* ASSIGNMENT TABLE */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h3 className="text-lg font-bold">
              Asset Assignment List
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Assign or return assets using the employee selector.
            </p>

          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ff5d73]" />

              <p className="text-sm text-slate-500">
                Loading assignments...
              </p>
            </div>
          ) : assets.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                ▣
              </div>

              <h3 className="mt-4 text-lg font-bold">
                No assets available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create assets from Asset Inventory first.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Asset
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tag
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Assign To
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {assets.map((asset) => (

                    <tr
                      key={asset._id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <p className="font-bold">
                          {asset.name ||
                            asset.assetName ||
                            "Unnamed Asset"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {asset.serialNumber ||
                            "No serial number"}
                        </p>

                      </td>

                      <td className="px-6 py-5 text-sm">
                        {asset.assetTag}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {asset.category ||
                          asset.assetType ||
                          "Other"}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            asset.status === "Assigned"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {asset.status || "Available"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <select
                          value={
                            asset.assignedTo?._id || ""
                          }
                          onChange={(e) =>
                            assignAsset(
                              asset._id,
                              e.target.value
                            )
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-[#ff5d73]"
                        >

                          <option value="">
                            Available / Return
                          </option>

                          {employees.map((employee) => (
                            <option
                              key={employee._id}
                              value={employee._id}
                            >
                              {employee.name}
                            </option>
                          ))}

                        </select>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <div className="mt-4 flex items-center justify-between">

        <p className="text-3xl font-bold">
          {value}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}