import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function AssetManagement() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    assetName: "",
    assetType: "",
    assetTag: "",
    serialNumber: "",
    purchaseDate: "",
    description: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [assetsResponse, usersResponse] = await Promise.all([
        api.get("/assets"),
        api.get("/assets/users"),
      ]);

      setAssets(assetsResponse.data.assets || []);
      setUsers(usersResponse.data.users || []);

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to load assets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createAsset = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await api.post("/assets", form);

      setMessage("Asset created successfully");

      setForm({
        assetName: "",
        assetType: "",
        assetTag: "",
        serialNumber: "",
        purchaseDate: "",
        description: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create asset"
      );
    }
  };

  const assignAsset = async (assetId, userId) => {
    try {
      setError("");
      setMessage("");

      await api.patch(`/assets/${assetId}/assign`, {
        userId: userId || null,
      });

      setMessage(
        userId
          ? "Asset assigned successfully"
          : "Asset returned successfully"
      );

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to assign asset"
      );
    }
  };

  const deleteAsset = async (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/assets/${assetId}`);

      setMessage("Asset deleted successfully");

      await loadData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to delete asset"
      );
    }
  };

  const statusClass = (status) => {
    if (status === "Available") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Assigned") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Maintenance") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              Asset Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage company IT assets
            </p>
          </div>

          <button
            onClick={() => navigate("/asset-manager")}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Assets
            </h2>

            <p className="text-sm text-gray-500">
              Total assets: {assets.length}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {showForm ? "Close" : "+ Add Asset"}
          </button>

        </div>

        {showForm && (
          <form
            onSubmit={createAsset}
            className="mb-8 rounded-xl border bg-white p-6 shadow-sm"
          >

            <h3 className="mb-5 text-lg font-bold">
              Add New Asset
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <input
                name="assetName"
                placeholder="Asset Name"
                value={form.assetName}
                onChange={handleChange}
                required
                className="rounded-lg border px-4 py-3"
              />

              <input
                name="assetType"
                placeholder="Asset Type"
                value={form.assetType}
                onChange={handleChange}
                required
                className="rounded-lg border px-4 py-3"
              />

              <input
                name="assetTag"
                placeholder="Asset Tag"
                value={form.assetTag}
                onChange={handleChange}
                required
                className="rounded-lg border px-4 py-3"
              />

              <input
                name="serialNumber"
                placeholder="Serial Number"
                value={form.serialNumber}
                onChange={handleChange}
                className="rounded-lg border px-4 py-3"
              />

              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                className="rounded-lg border px-4 py-3"
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="rounded-lg border px-4 py-3"
              />

            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
            >
              Create Asset
            </button>

          </form>
        )}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading assets...
            </div>
          ) : assets.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No assets found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Asset
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Tag
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Assigned To
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {assets.map((asset) => (
                    <tr key={asset._id}>

                      <td className="px-5 py-5">

                        <p className="font-semibold">
                          {asset.assetName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {asset.serialNumber || "No serial number"}
                        </p>

                      </td>

                      <td className="px-5 py-5 text-sm">
                        {asset.assetTag}
                      </td>

                      <td className="px-5 py-5 text-sm">
                        {asset.assetType}
                      </td>

                      <td className="px-5 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            asset.status
                          )}`}
                        >
                          {asset.status}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <select
                          value={asset.assignedTo?._id || ""}
                          onChange={(e) =>
                            assignAsset(
                              asset._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
                        >

                          <option value="">
                            Available
                          </option>

                          {users.map((user) => (
                            <option
                              key={user._id}
                              value={user._id}
                            >
                              {user.name}
                            </option>
                          ))}

                        </select>

                      </td>

                      <td className="px-5 py-5">

                        <button
                          onClick={() =>
                            deleteAsset(asset._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
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