import { useEffect, useState } from "react";
import api from "../services/api";

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get("/management/technicians");

      setTechnicians(
        response.data.technicians ||
          response.data.users ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Unable to load technicians."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicians();
  }, []);

  const toggleStatus = async (technician) => {
    try {
      const newStatus =
        technician.isActive === false ? true : false;

      await api.patch(`/management/users/${technician._id}/status`, {
        isActive: newStatus,
      });

      setMessage("Technician status updated.");
      loadTechnicians();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to update status."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#101b3d]">
            Technician Management
          </h1>
          <p className="mt-1 text-slate-500">
            Manage technicians and monitor their availability.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-sm">
          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Loading technicians...
            </p>
          ) : technicians.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              No technicians found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-sm text-slate-500">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {technicians.map((technician) => (
                    <tr
                      key={technician._id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-[#101b3d]">
                        {technician.name || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {technician.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {technician.department?.name ||
                          technician.department ||
                          "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {technician.role || "Technician"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            technician.isActive === false
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {technician.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(technician)}
                          className="rounded-lg bg-[#101b3d] px-4 py-2 text-xs font-semibold text-white"
                        >
                          {technician.isActive === false
                            ? "Activate"
                            : "Deactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}