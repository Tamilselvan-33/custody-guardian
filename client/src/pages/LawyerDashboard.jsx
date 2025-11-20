import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AlertCard } from "../components/AlertCard";
import { useAlertsChannel } from "../hooks/useAlertsChannel";

export const LawyerDashboard = () => {
  const { request } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [updating, setUpdating] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    const data = await request("/api/alerts/lawyer");
    setAlerts(data);
    setLoading(false);
  }, [request]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useAlertsChannel((event) => {
    if (!event?.alert) return;
    setAlerts((prev) => {
      const others = prev.filter((a) => a.id !== event.alert.id);
      return [event.alert, ...others];
    });
  });

  const handleAction = async (id, payload) => {
    setUpdating(id);
    try {
      const data = await request(`/api/alerts/${id}/lawyer-action`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setAlerts((prev) => {
        const others = prev.filter((a) => a.id !== id);
        return [data, ...others];
      });
    } finally {
      setUpdating("");
    }
  };

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="muted">Lawyer dashboard</p>
          <h2>Auto-escalated custody alerts</h2>
        </div>
      </header>

      {loading && <p>Loading escalations...</p>}
      {!loading && alerts.length === 0 && (
        <p>No escalated alerts. Everything is updated.</p>
      )}

      <div className="grid">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            footer={
              <LawyerActionForm
                defaultNotes={alert.legalActionNotes}
                disabled={updating === alert.id}
                onSubmit={(payload) => handleAction(alert.id, payload)}
              />
            }
          />
        ))}
      </div>
    </section>
  );
};

const LawyerActionForm = ({ defaultNotes, onSubmit, disabled }) => {
  const [notes, setNotes] = useState(defaultNotes || "");
  const [status, setStatus] = useState("legal-review");

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ legalActionNotes: notes, status });
  };

  return (
    <form className="stack" onSubmit={submit}>
      <label className="field">
        <span>Legal action</span>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Summons issued, production writ filed..."
        />
      </label>
      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="legal-review">In legal review</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <button className="primary" type="submit" disabled={disabled}>
        {disabled ? "Submitting..." : "Mark legal action"}
      </button>
    </form>
  );
};

