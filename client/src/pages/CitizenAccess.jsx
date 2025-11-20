import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginCard } from "../components/LoginCard";

const useRegisterForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const reset = () => setForm({ fullName: "", email: "", password: "" });
  return { form, update, reset };
};

export const CitizenAccess = () => {
  const { registerCitizen, login, loading, error } = useAuth();
  const { form, update, reset } = useRegisterForm();
  const [registering, setRegistering] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setRegistering(true);
    try {
      await registerCitizen(form);
      reset();
    } finally {
      setRegistering(false);
    }
  };

  return (
    <section className="auth-layout">
      <div>
        <Link className="back-link" to="/">
          ← Back to overview
        </Link>
        <h2>Citizen workspace</h2>
        <p className="muted">
          Create an alert-ready account or sign in to track active custody alerts in real time.
        </p>
      </div>

      <div className="auth-panels">
        <form className="card stack" onSubmit={handleSignup}>
          <p className="muted">Register</p>
          <h3>Raise alerts instantly</h3>
          <label className="field">
            <span>Full name</span>
            <input
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="Aarav Sharma"
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={update("password")}
              required
            />
          </label>
          <button className="primary" type="submit" disabled={registering}>
            {registering ? "Creating..." : "Create account"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <div className="card stack">
          <p className="muted">Already registered?</p>
          <LoginCard role="citizen" onSubmit={login} loading={loading} framed={false} />
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </section>
  );
};

