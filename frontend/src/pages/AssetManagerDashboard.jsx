import { useEffect, useState } from "react";
import api from "../services/api";

function AssetManagerDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // IMPORTANT:
  // These names must match the backend:
  // name, type, assetTag
  const [asset, setAsset] = useState({
    assetTag: "",
    name: "",
    type: "Laptop",
    serialNumber: "",
    purchaseDate: "",
    description: "",
  });

  // =========================
  // FETCH ASSETS
  // =========================
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

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAsset((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // CREATE ASSET
  // =========================
  const createAsset = async (e) => {
    e.preventDefault();

    setError("");

    // Frontend validation
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

      // EXACT DATA SENT TO BACKEND
      const payload = {
        name: asset.name.trim(),
        type: asset.type.trim(),
        assetTag: asset.assetTag.trim(),
        serialNumber: asset.serialNumber.trim(),
        purchaseDate: asset.purchaseDate,
        description: asset.description.trim(),
      };

      console.log("Creating asset with:", payload);

      const response = await api.post(
        "/assets",
        payload
      );

      console.log(
        "Asset created successfully:",
        response.data
      );

      alert("Asset created successfully.");

      // Clear form
      setAsset({
        assetTag: "",
        name: "",
        type: "Laptop",
        serialNumber: "",
        purchaseDate: "",
        description: "",
      });

      // Close form
      setShowForm(false);

      // Refresh assets
      await fetchAssets();
    } catch (err) {
      console.error(
        "Create asset error:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to create asset."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // COUNTS
  // =========================
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
    <div className="min-h-screen bg-slate-50 p-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Asset Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Asset Manager Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Manage company assets and employee assignments.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
            }}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            {showForm ? "Close" : "+ Add Asset"}
          </button>

          <button
            type="button"
            onClick={fetchAssets}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>

        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* =========================
          ADD ASSET FORM
      ========================= */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Add New Asset
          </h2>

          <form
            onSubmit={createAsset}
            className="grid gap-4"
          >

            {/* Asset Tag */}
            <input
              type="text"
              name="assetTag"
              placeholder="Asset Tag (example: T01)"
              value={asset.assetTag}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            {/* Asset Name */}
            <input
              type="text"
              name="name"
              placeholder="Asset Name (example: Dell Laptop)"
              value={asset.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            {/* Asset Type */}
            <select
              name="type"
              value={asset.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              required
            >
              <option value="Laptop">
                Laptop
              </option>

              <option value="Desktop">
                Desktop
              </option>

              <option value="Monitor">
                Monitor
              </option>

              <option value="Keyboard">
                Keyboard
              </option>

              <option value="Mouse">
                Mouse
              </option>

              <option value="Printer">
                Printer
              </option>

              <option value="Phone">
                Phone
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* Serial Number */}
            <input
              type="text"
              name="serialNumber"
              placeholder="Serial Number (example: DL001)"
              value={asset.serialNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />

            {/* Purchase Date */}
            <input
              type="date"
              name="purchaseDate"
              value={asset.purchaseDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description (example: Company laptop)"
              value={asset.description}
              onChange={handleChange}
              rows="4"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="w-fit rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating
                ? "Creating..."
                : "Create Asset"}
            </button>

          </form>
        </div>
      )}

      {/* =========================
          STATISTICS
      ========================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Assets
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalAssets}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {availableAssets}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Assigned
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {assignedAssets}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Maintenance
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {maintenanceAssets}
          </p>
        </div>

      </div>

      {/* =========================
          ASSET INVENTORY
      ========================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Asset Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All company assets
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">
            Loading assets...
          </p>
        ) : assets.length === 0 ? (
          <div className="rounded-lg bg-slate-50 py-10 text-center">

            <p className="font-medium text-slate-700">
              No assets found.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Click "+ Add Asset" to create your first asset.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] border-collapse">

              <thead>
                <tr className="border-b border-slate-200 text-left">

                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Asset Tag
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Name
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Type
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Serial Number
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
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
                    className="border-b border-slate-100"
                  >

                    <td className="px-4 py-4 font-medium text-slate-900">
                      {item.assetTag || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.name || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.type || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.serialNumber || "-"}
                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
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

    </div>
  );
}

export default AssetManagerDashboard;