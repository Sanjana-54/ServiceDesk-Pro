import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "System Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "IT Manager") {
      return <Navigate to="/manager" replace />;
    }

    if (user.role === "Asset Manager") {
      return <Navigate to="/asset-manager" replace />;
    }

    if (user.role === "Technician") {
      return <Navigate to="/technician" replace />;
    }

    return <Navigate to="/employee" replace />;
  }

  return children;
}

export default ProtectedRoute;