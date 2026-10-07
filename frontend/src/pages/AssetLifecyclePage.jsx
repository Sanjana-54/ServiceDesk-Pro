import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AssetLifecyclePage() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] =
    useState("");

  const [lifecycle, setLifecycle] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    lifecycleStatus: "Procured",
    warrantyStartDate: "",
    warrantyEndDate: "",
    vendor: "",
    purchaseCost: "",
    purchaseOrderNumber: "",
    location: "",
    notes: "",
  });

  // =========================================
  // LOAD ASSETS
  // =========================================

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/assets");

      const assetList =
        response.data?.assets || [];

      setAssets(assetList);

      if (assetList.length > 0) {
        setSelectedAsset(assetList[0]._id);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load assets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // =========================================
  // LOAD LIFECYCLE
  // =========================================

  const loadLifecycle = async (assetId) => {
    if (!assetId) {
      setLifecycle(null);
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await api.get(
        `/asset-lifecycle/${assetId}`
      );

      const data =
        response.data?.lifecycle || null;

      setLifecycle(data);

      if (data) {
        setForm({
          lifecycleStatus:
            data.lifecycleStatus || "Procured",

          warrantyStartDate: data.warrantyStartDate
            ? data.warrantyStartDate.substring(0, 10)
            : "",

          warrantyEndDate: data.warrantyEndDate
            ? data.warrantyEndDate.substring(0, 10)
            : "",

          vendor: data.vendor || "",

          purchaseCost:
            data.purchaseCost !== undefined &&
            data.purchaseCost !== null
              ? data.purchaseCost
              : "",

          purchaseOrderNumber:
            data.purchaseOrderNumber || "",

          location: data.location || "",

          notes: data.notes || "",
        });
      } else {
        setForm({
          lifecycleStatus: "Procured",
          warrantyStartDate: "",
          warrantyEndDate: "",
          vendor: "",
          purchaseCost: "",
          purchaseOrderNumber: "",
          location: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load lifecycle information."
      );
    }
  };

  useEffect(() => {
    if (selectedAsset) {
      loadLifecycle(selectedAsset);
    }
  }, [selectedAsset]);

  // =========================================
  // HANDLE FORM
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
  // SAVE LIFECYCLE
  // =========================================

  const saveLifecycle = async (e) => {
    e.preventDefault();

    if (!selectedAsset) {
      setError("Please select an asset.");
      return;
    }

    if (
      form.warrantyStartDate &&
      form.warrantyEndDate &&
      form.warrantyEndDate <
        form.warrantyStartDate
    ) {
      setError(
        "Warranty end date cannot be before start date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/asset-lifecycle/${selectedAsset}`,
        {
          lifecycleStatus:
            form.lifecycleStatus,

          warrantyStartDate:
            form.warrantyStartDate || null,

          warrantyEndDate:
            form.warrantyEndDate || null,

          vendor: form.vendor,

          purchaseCost:
            form.purchaseCost === ""
              ? 0
              : Number(form.purchaseCost),

          purchaseOrderNumber:
            form.purchaseOrderNumber,

          location: form.location,

          notes: form.notes,
        }
      );

      setLifecycle(
        response.data?.lifecycle || null
      );

      setMessage(
        "Asset lifecycle updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to update asset lifecycle."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedAssetData = assets.find(
    (asset) => asset._id === selectedAsset
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
              Warranty & Lifecycle
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track warranty information and asset lifecycle.
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
            Lifecycle Center
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Track the complete asset lifecycle
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Manage warranty dates, vendors, purchase details,
            location and lifecycle status for every asset.
          </p>

        </section>

        {/* ASSET SELECTOR */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <label className="mb-2 block text-sm font-bold text-[#172033]">
            Select Asset
          </label>

          {loading ? (
            <p className="text-sm text-slate-500">
              Loading assets...
            </p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-slate-500">
              No assets available. Create an asset first.
            </p>
          ) : (
            <select
              value={selectedAsset}
              onChange={(e) =>
                setSelectedAsset(e.target.value)
              }
              className="w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#ff5d73] focus:bg-white"
            >
              {assets.map((asset) => (
                <option
                  key={asset._id}
                  value={asset._id}
                >
                  {asset.assetTag} —{" "}
                  {asset.name ||
                    asset.assetName ||
                    "Unnamed Asset"}
                </option>
              ))}
            </select>
          )}

        </section>

        {selectedAssetData && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
              Selected Asset
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {selectedAssetData.name ||
                selectedAssetData.assetName ||
                "Unnamed Asset"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {selectedAssetData.assetTag}
              {selectedAssetData.serialNumber
                ? ` • ${selectedAssetData.serialNumber}`
                : ""}
            </p>

          </section>
        )}

        {/* FORM */}

        {selectedAsset && (
          <form
            onSubmit={saveLifecycle}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="mb-6">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5d73]">
                Asset Details
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Warranty & Lifecycle Information
              </h3>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* STATUS */}

              <Field label="Lifecycle Status">
                <select
                  name="lifecycleStatus"
                  value={form.lifecycleStatus}
                  onChange={handleChange}
                  className="input"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </Field>

              {/* VENDOR */}

              <Field label="Vendor">
                <input
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  placeholder="Vendor name"
                  className="input"
                />
              </Field>

              {/* WARRANTY START */}

              <Field label="Warranty Start">
                <input
                  type="date"
                  name="warrantyStartDate"
                  value={form.warrantyStartDate}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              {/* WARRANTY END */}

              <Field label="Warranty End">
                <input
                  type="date"
                  name="warrantyEndDate"
                  value={form.warrantyEndDate}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              {/* PURCHASE COST */}

              <Field label="Purchase Cost">
                <input
                  type="number"
                  min="0"
                  name="purchaseCost"
                  value={form.purchaseCost}
                  onChange={handleChange}
                  placeholder="0"
                  className="input"
                />
              </Field>

              {/* PURCHASE ORDER */}

              <Field label="Purchase Order Number">
                <input
                  name="purchaseOrderNumber"
                  value={form.purchaseOrderNumber}
                  onChange={handleChange}
                  placeholder="PO-001"
                  className="input"
                />
              </Field>

              {/* LOCATION */}

              <Field label="Location">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Hyderabad Office"
                  className="input"
                />
              </Field>

              {/* NOTES */}

              <Field label="Notes">
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional information"
                  className="input"
                />
              </Field>

            </div>

            {/* SAVE */}

            <div className="mt-7 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#ff5d73] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#f34f67] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Lifecycle Information"}
              </button>

            </div>

          </form>
        )}

      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}