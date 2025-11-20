import { useState } from "react";

const roleLabels = {
  citizen: "Citizen login",
  police: "Police login",
  lawyer: "Lawyer login",
};

export const LoginCard = ({ role, onSubmit, loading, framed = true }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const classes = ["stack", "login-card"];
  if (framed) classes.unshift("card");

  return (
    <form className={classes.join(" ")} onSubmit={handleSubmit}>
      <h3>{roleLabels[role]}</h3>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@agency.org"
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>
      <button className="primary" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

