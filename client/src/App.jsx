import { useMemo } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Landing } from "./pages/Landing";
import { CitizenAccess } from "./pages/CitizenAccess";
import { RoleLogin } from "./pages/RoleLogin";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { PoliceDashboard } from "./pages/PoliceDashboard";
import { LawyerDashboard } from "./pages/LawyerDashboard";

const App = () => {
  const { user, logout } = useAuth();

  const dashboard = useMemo(() => {
    if (!user) return null;
    if (user.role === "citizen") return <CitizenDashboard />;
    if (user.role === "police") return <PoliceDashboard />;
    if (user.role === "lawyer") return <LawyerDashboard />;
    return null;
  }, [user]);

  return (
    <div>
      <nav className="nav">
        <div className="brand">
          <Link className="logo" to="/">
            Custody Guardian
          </Link>
          <p className="muted">
            Transparent custody tracking for citizens, police and lawyers
          </p>
        </div>
        {user ? (
          <div className="nav-user">
            <span>
              {user.fullName} · {user.role}
            </span>
            <button onClick={logout}>Sign out</button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/citizen">Citizen</Link>
            <Link to="/police">Police</Link>
            <Link to="/lawyer">Lawyer</Link>
          </div>
        )}
      </nav>

      <Routes>
        {user ? (
          <>
            <Route path="/" element={dashboard} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/citizen" element={<CitizenAccess />} />
            <Route path="/police" element={<RoleLogin role="police" />} />
            <Route path="/lawyer" element={<RoleLogin role="lawyer" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;

