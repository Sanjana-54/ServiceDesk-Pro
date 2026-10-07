import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TechnicianTickets from "./pages/TechnicianTickets";
import TechnicianWorkLogs from "./pages/TechnicianWorkLogs";

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

import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseManagement from "./pages/KnowledgeBaseManagement";
import SLAMonitor from "./pages/SLAMonitor";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTHENTICATION */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* EMPLOYEE */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN */}

        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["Technician"]}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/tickets"
          element={
            <ProtectedRoute allowedRoles={["Technician"]}>
              <TechnicianTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/work-logs"
          element={
            <ProtectedRoute allowedRoles={["Technician"]}>
              <TechnicianWorkLogs />
            </ProtectedRoute>
          }
        />

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

        {/* SYSTEM ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["System Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["System Admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowedRoles={["System Admin"]}>
              <AdminTickets />
            </ProtectedRoute>
          }
        />

        {/* IT MANAGER */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["IT Manager"]}>
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

        {/* ASSET MANAGER */}

        <Route
          path="/asset-manager"
          element={
            <ProtectedRoute allowedRoles={["Asset Manager"]}>
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

        {/* SLA */}

        <Route
          path="/sla-monitor"
          element={
            <ProtectedRoute
              allowedRoles={[
                "System Admin",
                "IT Manager",
              ]}
            >
              <SLAMonitor />
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "System Admin",
                "IT Manager",
              ]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* AUDIT */}

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["System Admin"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* KNOWLEDGE BASE */}

        <Route
          path="/knowledge"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Employee",
                "Technician",
                "IT Manager",
                "System Admin",
                "Asset Manager",
              ]}
            >
              <KnowledgeBase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/knowledge/manage"
          element={
            <ProtectedRoute
              allowedRoles={[
                "System Admin",
                "IT Manager",
              ]}
            >
              <KnowledgeBaseManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;