import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AssetManagerDashboard() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [asset, setAsset] = useState({
    assetTag: "",
    name: "",
    type: "Laptop",
    serialNumber: "",
    purchaseDate: "",
    description: "",
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assets");

      setAssets(
        response.data?.assets ||
          response.data ||
          []
      );
    } catch (err) {
      console.error("Fetch assets error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load assets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAsset((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const createAsset = async (e) => {
    e.preventDefault();
    setError("");

    if (!asset.name.trim()) {
      setError("Asset name is required.");
      return;
    }

    if (!asset.type.trim()) {
      setError("Asset type is required.");
      return;
    }

    if (!asset.assetTag.trim()) {
      setError("Asset tag is required.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name: asset.name.trim(),
        type: asset.type.trim(),
        assetTag: asset.assetTag.trim(),
        serialNumber: asset.serialNumber.trim(),
        purchaseDate: asset.purchaseDate,
        description: asset.description.trim(),
      };

      const response = await api.post(
        "/assets",
        payload
      );

      console.log(
        "Asset created successfully:",
        response.data
      );

      alert("Asset created successfully.");

      setAsset({
        assetTag: "",
        name: "",
        type: "Laptop",
        serialNumber: "",
        purchaseDate: "",
        description: "",
      });

      setShowForm(false);

      await fetchAssets();

    } catch (err) {
      console.error("Create asset error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create asset."
      );
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (item) =>
      item.status === "Available" ||
      item.status === "available" ||
      !item.assignedTo
  ).length;

  const assignedAssets = assets.filter(
    (item) =>
      item.status === "Assigned" ||
      item.status === "assigned" ||
      item.assignedTo
  ).length;

  const maintenanceAssets = assets.filter(
    (item) =>
      item.status === "Maintenance" ||
      item.status === "maintenance"
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        <div className="border-b border-slate-100 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] font-bold text-white shadow-md">
              SD
            </div>

            <div>
              <h1 className="font-bold text-[#172554]">
                ServiceDesk Pro
              </h1>

              <p className="text-xs text-slate-400">
                IT Service Management
              </p>
            </div>

          </div>

        </div>

        <div className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Asset Management
          </p>

          <button
            onClick={() => navigate("/asset-manager")}
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            onClick={() => {
              setShowForm(true);
              setError("");
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>＋</span>
            Add Asset
          </button>

          <button
            onClick={fetchAssets}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>↻</span>
            Refresh Assets
          </button>

          <div className="mt-10 px-3">

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Asset System Online
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Manage company hardware, inventory and employee assignments.
            </p>

          </div>

        </div>

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] font-bold text-white">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-800">
                {user.name || "Asset Manager"}
              </p>

              <p className="text-xs text-slate-400">
                Asset Manager
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="lg:ml-64">

        <header className="border-b border-slate-200 bg-white">

          <div className="flex items-center justify-between px-5 py-5 sm:px-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ef5b73]">
                Asset Management
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#172554] sm:text-3xl">
                Asset Manager Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage company assets and employee assignments.
              </p>

            </div>

            <div className="flex gap-2">

              <button
                onClick={fetchAssets}
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#ef5b73] hover:text-[#ef5b73] sm:block"
              >
                ↻ Refresh
              </button>

              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setError("");
                }}
                className="rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md"
              >
                {showForm ? "Close" : "+ Add Asset"}
              </button>

            </div>

          </div>

        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">

          {/* HERO */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#243b78] to-[#ef5b73] p-6 text-white shadow-lg sm:p-8">

            <div className="relative z-10">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Asset Operations
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Know where every asset belongs.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Track company equipment, monitor availability and maintain an organized asset inventory.
              </p>

            </div>

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5" />

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* FORM */}
          {showForm && (

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <p className="text-xs font-bold uppercase tracking-wider text-[#ef5b73]">
                  Inventory
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#172554]">
                  Add New Asset
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of the company asset.
                </p>

              </div>

              <form
                onSubmit={createAsset}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Asset Tag
                  </label>

                  <input
                    type="text"
                    name="assetTag"
                    placeholder="Example: LAP-001"
                    value={asset.assetTag}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#ef5b73] focus:ring-2 focus:ring-[#ef5b73]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Asset Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Example: Dell Laptop"
                    value={asset.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#ef5b73] focus:ring-2 focus:ring-[#ef5b73]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Asset Type
                  </label>

                  <select
                    name="type"
                    value={asset.type}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#ef5b73]"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Printer">Printer</option>
                    <option value="Phone">Phone</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    name="serialNumber"
                    placeholder="Example: DL001"
                    value={asset.serialNumber}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#ef5b73]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Purchase Date
                  </label>

                  <input
                    type="date"
                    name="purchaseDate"
                    value={asset.purchaseDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#ef5b73]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    placeholder="Example: Company laptop"
                    value={asset.description}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#ef5b73]"
                  />
                </div>

                <div className="flex items-end md:col-span-2">

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-7 py-3 font-semibold text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating
                      ? "Creating..."
                      : "Create Asset"}
                  </button>

                </div>

              </form>

            </div>

          )}

          {/* STATS */}
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              ["Total Assets", totalAssets, "bg-blue-50", "text-blue-600", "💻"],
              ["Available", availableAssets, "bg-emerald-50", "text-emerald-600", "✓"],
              ["Assigned", assignedAssets, "bg-purple-50", "text-purple-600", "👤"],
              ["Maintenance", maintenanceAssets, "bg-orange-50", "text-orange-600", "⚙"],
            ].map(([title, value, bg, color, icon]) => (

              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#172554]">
                      {value}
                    </p>
                  </div>

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}>
                    {icon}
                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* INVENTORY */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <h2 className="text-xl font-bold text-[#172554]">
                Asset Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                All company assets and their current status.
              </p>

            </div>

            {loading ? (

              <div className="p-12 text-center">

                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#ef5b73]" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading assets...
                </p>

              </div>

            ) : assets.length === 0 ? (

              <div className="p-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
                  💻
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  No assets found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Click "+ Add Asset" to create your first asset.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-200 text-left">

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Asset Tag
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Name
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Serial Number
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {assets.map((item) => (

                      <tr
                        key={
                          item._id ||
                          item.id ||
                          item.assetTag
                        }
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >

                        <td className="px-5 py-5">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-[#172554]">
                            {item.assetTag || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-5 font-semibold text-slate-800">
                          {item.name || "-"}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {item.type || "-"}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {item.serialNumber || "-"}
                        </td>

                        <td className="px-5 py-5">

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            {item.status || "Available"}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          <div className="py-8 text-center text-xs text-slate-400">
            ServiceDesk Pro · Asset Management
          </div>

        </div>

      </main>

    </div>
  );
}

export default AssetManagerDashboard;