import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function TechnicianManagement() {
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTechnicians = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/users/technicians"
      );

      setTechnicians(
        response.data.technicians || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load technicians"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Technician Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage IT support technicians
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/it-manager")
            }
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Technicians
            </h2>

            <p className="text-sm text-gray-500">
              Total technicians: {technicians.length}
            </p>
          </div>

          <button
            onClick={fetchTechnicians}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            ↻ Refresh
          </button>

        </div>


        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading technicians...
            </div>

          ) : technicians.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No technicians found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Role
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {technicians.map((technician) => (

                    <tr key={technician._id}>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {technician.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <span className="font-semibold">
                            {technician.name}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {technician.email}
                      </td>

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {technician.role}
                        </span>

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

export default TechnicianManagement;