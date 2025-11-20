import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginCard } from "../components/LoginCard";

const roleCopy = {
  police: {
    title: "Police control room",
    description:
      "Authenticate with your duty email to receive custody alerts, log welfare updates, and certify 24-hour court production.",
  },
  lawyer: {
    title: "Legal escalation desk",
    description:
      "Authorized lawyers can review auto-escalated alerts, coordinate with families, and record legal action taken.",
  },
};

export const RoleLogin = ({ role }) => {
  const { login, loading, error } = useAuth();
  const copy = roleCopy[role];

  return (
    <section className="auth-layout">
      <div>
        <Link className="back-link" to="/">
          ← Back to overview
        </Link>
        <h2>{copy.title}</h2>
        <p className="muted">{copy.description}</p>
      </div>
      <div className="card stack">
        <LoginCard role={role} onSubmit={login} loading={loading} framed={false} />
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
};

