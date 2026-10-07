import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AssetManagement() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    assetTag: "",
    name: "",
    category: "Laptop",
    serialNumber: "",
    purchaseDate: "",
    notes: "",
  });

  // =========================================
  // LOAD ASSETS + EMPLOYEES
  // =========================================

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
      setEmployees(employeesResponse.data?.employees || []);
    } catch (error) {
      console.error("Load asset data error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load asset information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // CREATE ASSET
  // =========================================

  const createAsset = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.assetTag.trim()) {
      setError("Asset tag is required.");
      return;
    }

    if (!form.name.trim()) {
      setError("Asset name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Asset category is required.");
      return;
    }

    try {
      setCreating(true);

      await api.post("/assets", {
        assetTag: form.assetTag.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        serialNumber: form.serialNumber.trim(),
        purchaseDate: form.purchaseDate || null,
        notes: form.notes.trim(),
      });

      setMessage("Asset created successfully.");

      setForm({
        assetTag: "",
        name: "",
        category: "Laptop",
        serialNumber: "",
        purchaseDate: "",
        notes: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Create asset error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create asset."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================
  // ASSIGN / UNASSIGN ASSET
  // =========================================

  const assignAsset = async (assetId, employeeId) => {
    try {
      setError("");
      setMessage("");

      await api.patch(`/assets/${assetId}/assign`, {
        userId: employeeId || null,
      });

      setMessage(
        employeeId
          ? "Asset assigned successfully."
          : "Asset returned successfully."
      );

      await loadData();
    } catch (error) {
      console.error("Assign asset error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update asset assignment."
      );
    }
  };

  // =========================================
  // DELETE ASSET
  // =========================================

  const deleteAsset = async (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/assets/${assetId}`);

      setMessage("Asset deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete asset error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete asset."
      );
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    if (status === "Available") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    }

    if (status === "Assigned") {
      return "bg-blue-50 text-blue-700 border border-blue-100";
    }

    if (
      status === "Maintenance" ||
      status === "Under Repair"
    ) {
      return "bg-amber-50 text-amber-700 border border-amber-100";
    }

    if (status === "Retired") {
      return "bg-slate-100 text-slate-600 border border-slate-200";
    }

    return "bg-slate-50 text-slate-600 border border-slate-200";
  };

  // =========================================
  // DISPLAY NAME
  // =========================================

  const getAssetName = (asset) => {
    return asset.name || asset.assetName || "Unnamed Asset";
  };

  const getAssetCategory = (asset) => {
    return asset.category || asset.assetType || "Other";
  };

  // =========================================
  // DASHBOARD
  // =========================================

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "Available"
  ).length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "Assigned"
  ).length;

  const repairAssets = assets.filter(
    (asset) =>
      asset.status === "Maintenance" ||
      asset.status === "Under Repair"
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">

      {/* =========================================
          TOP HEADER
      ========================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
              Asset Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#172033]">
              Asset Inventory
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage company hardware, software and assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/asset-manager")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] shadow-sm transition hover:bg-slate-50"
            >
              ← Dashboard
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-bold">
                  {user?.name || "Asset Manager"}
                </p>

                <p className="text-xs text-slate-500">
                  {user?.role || "Asset Manager"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#273b7a] to-[#ff5d73] text-sm font-bold text-white">
                {(user?.name || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="mx-auto max-w-[1500px] px-6 py-8">

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* =========================================
            HERO
        ========================================= */}

        <section className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#17245c] via-[#44316e] to-[#ff5d73] p-7 text-white shadow-lg">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Asset Operations
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Know where every asset stands
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Manage inventory, assignments, asset status and
                the complete IT asset lifecycle.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-7 py-5 text-center backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                Total Assets
              </p>

              <p className="mt-1 text-4xl font-bold">
                {totalAssets}
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            STAT CARDS
        ========================================= */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Assets
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#172033]">
                {totalAssets}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ▣
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Available
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#172033]">
                {availableAssets}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                ✓
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Assigned
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#172033]">
                {assignedAssets}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                ♙
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Under Repair
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#172033]">
                {repairAssets}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                ⚙
              </div>
            </div>
          </div>

        </section>

        {/* =========================================
            ASSET SECTION HEADER
        ========================================= */}

        <section className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
              Inventory
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#172033]">
              Company Assets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View, create and assign IT assets.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setMessage("");
            }}
            className="rounded-xl bg-[#ff5d73] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#f34f67]"
          >
            {showForm ? "Close Form" : "+ Add Asset"}
          </button>

        </section>

        {/* =========================================
            CREATE ASSET FORM
        ========================================= */}

        {showForm && (
          <form
            onSubmit={createAsset}
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
                New Asset
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#172033]">
                Add a company asset
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic information for the new asset.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Asset Tag
                </label>

                <input
                  name="assetTag"
                  value={form.assetTag}
                  onChange={handleChange}
                  placeholder="AST-001"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Asset Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dell Latitude Laptop"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Printer">Printer</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Network">Network</option>
                  <option value="Software">Software</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Serial Number
                </label>

                <input
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
                  placeholder="Serial number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Purchase Date
                </label>

                <input
                  type="date"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional information"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff5d73] focus:bg-white focus:ring-2 focus:ring-[#ff5d73]/10"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-[#17245c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#111b49] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Asset"}
              </button>
            </div>

          </form>
        )}

        {/* =========================================
            ASSET TABLE
        ========================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-[#172033]">
                  Asset Inventory
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {totalAssets} asset
                  {totalAssets !== 1 ? "s" : ""} registered
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {totalAssets} Total
              </div>

            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ff5d73]" />

              <p className="text-sm font-medium text-slate-500">
                Loading assets...
              </p>
            </div>
          ) : assets.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                ▣
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#172033]">
                No assets found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your asset inventory is currently empty.
                Click "Add Asset" to create your first company
                asset.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

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
                      Assigned To
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {assets.map((asset) => (

                    <tr
                      key={asset._id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <p className="font-bold text-[#172033]">
                          {getAssetName(asset)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {asset.serialNumber ||
                            "No serial number"}
                        </p>

                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {asset.assetTag}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {getAssetCategory(asset)}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                            asset.status
                          )}`}
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
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#ff5d73]"
                        >

                          <option value="">
                            Available
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

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            deleteAsset(asset._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AssetManagement;