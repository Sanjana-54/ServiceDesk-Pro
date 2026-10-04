import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ITManagerDashboard from "./pages/ITManagerDashboard";
import AssetManagerDashboard from "./pages/AssetManagerDashboard";

import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";

import UserManagement from "./pages/UserManagement";
import AdminTickets from "./pages/AdminTickets";

import AssetManagement from "./pages/AssetManagement";
import TechnicianManagement from "./pages/TechnicianManagement";
import TicketManagement from "./pages/TicketManagement";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            AUTH
        ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            EMPLOYEE
        ========================= */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={["Employee"]}
            >
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute
              allowedRoles={["Employee"]}
            >
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute
              allowedRoles={["Employee"]}
            >
              <CreateTicket />
            </ProtectedRoute>
          }
        />


        {/* =========================
            TECHNICIAN
        ========================= */}

        <Route
          path="/technician"
          element={
            <ProtectedRoute
              allowedRoles={["Technician"]}
            >
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        {/* Technician management:
            System Admin + IT Manager
        */}

        <Route
          path="/technician-management"
          element={
            <ProtectedRoute
              allowedRoles={[
                "System Admin",
                "IT Manager",
              ]}
            >
              <TechnicianManagement />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SYSTEM ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["System Admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              allowedRoles={["System Admin"]}
            >
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute
              allowedRoles={["System Admin"]}
            >
              <AdminTickets />
            </ProtectedRoute>
          }
        />


        {/* =========================
            IT MANAGER
        ========================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute
              allowedRoles={["IT Manager"]}
            >
              <ITManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ticket-management"
          element={
            <ProtectedRoute
              allowedRoles={[
                "System Admin",
                "IT Manager",
              ]}
            >
              <TicketManagement />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ASSET MANAGER
        ========================= */}

        <Route
          path="/asset-manager"
          element={
            <ProtectedRoute
              allowedRoles={["Asset Manager"]}
            >
              <AssetManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Asset Manager",
                "System Admin",
              ]}
            >
              <AssetManagement />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;