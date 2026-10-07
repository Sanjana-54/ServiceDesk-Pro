import { useEffect, useState } from "react";
import api from "../services/api";

const statuses = [
  "Procured",
  "Available",
  "Assigned",
  "Under Repair",
  "Replaced",
  "Retired",
  "Disposed",
];

export default function AssetLifecycle({ assetId }) {
  const [lifecycle, setLifecycle] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLifecycle = async () => {
    if (!assetId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `/asset-lifecycle/${assetId}`
      );

      setLifecycle(response.data.lifecycle || response.data || {});
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load lifecycle information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLifecycle();
  }, [assetId]);

  const updateStatus = async (status) => {
    try {
      await api.patch(
        `/asset-lifecycle/${assetId}/status`,
        {
          lifecycleStatus: status,
        }
      );

      setLifecycle((previous) => ({
        ...previous,
        lifecycleStatus: status,
      }));

      setMessage("Lifecycle status updated.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update lifecycle."
      );
    }
  };

  if (!assetId) {
    return (
      <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
        Select an asset to view lifecycle information.
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading lifecycle...
      </p>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#101b3d]">
        Asset Lifecycle
      </h2>

      {message && (
        <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {message}
        </p>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Info
          label="Vendor"
          value={lifecycle.vendor || "—"}
        />

        <Info
          label="Purchase Cost"
          value={
            lifecycle.purchaseCost !== undefined
              ? `₹${lifecycle.purchaseCost}`
              : "—"
          }
        />

        <Info
          label="Location"
          value={lifecycle.location || "—"}
        />

        <Info
          label="Purchase Order"
          value={lifecycle.purchaseOrderNumber || "—"}
        />

        <Info
          label="Warranty Start"
          value={
            lifecycle.warrantyStartDate
              ? new Date(
                  lifecycle.warrantyStartDate
                ).toLocaleDateString()
              : "—"
          }
        />

        <Info
          label="Warranty End"
          value={
            lifecycle.warrantyEndDate
              ? new Date(
                  lifecycle.warrantyEndDate
                ).toLocaleDateString()
              : "—"
          }
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-[#101b3d]">
          Lifecycle Status
        </label>

        <select
          value={lifecycle.lifecycleStatus || "Available"}
          onChange={(e) => updateStatus(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#ff6b5f]"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-[#101b3d]">
        {value}
      </p>
    </div>
  );
}