import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/employee" element={<EmployeeDashboard />} />

        <Route path="/technician" element={<TechnicianDashboard />} />

        <Route
  path="/admin"
  element={<AdminDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;