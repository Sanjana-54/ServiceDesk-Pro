import { useNavigate } from "react-router-dom";
import "./AppLayout.css";

function AppLayout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            SD
          </div>

          <div>
            <h2>ServiceDesk</h2>
            <span>Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            onClick={() => navigate("/employee")}
          >
            <span>▣</span>
            Dashboard
          </button>

          <button>
            <span>🎫</span>
            My Tickets
          </button>

          <button>
            <span>＋</span>
            Create Ticket
          </button>

          <button>
            <span>◉</span>
            Profile
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user.name || "User"}</strong>
              <small>{user.role || "Employee"}</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="app-main">

        <header className="topbar">

          <div>
            <h3>
              Welcome, {user.name || "User"}
            </h3>

            <p>
              ServiceDesk Pro
            </p>
          </div>

        </header>

        <section className="page-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default AppLayout;