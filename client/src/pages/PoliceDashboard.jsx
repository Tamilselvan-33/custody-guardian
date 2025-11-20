import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AlertCard } from "../components/AlertCard";
import { useAlertsChannel } from "../hooks/useAlertsChannel";

export const PoliceDashboard = () => {
  const { request } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  const fetchAlerts = useCallback(async () => {
    const data = await request("/api/alerts/police");
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

  const handleUpdate = async (id, payload) => {
    setUpdating(id);
    try {
      const data = await request(`/api/alerts/${id}/police-update`, {
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
          <p className="muted">Police dashboard</p>
          <h2>Live custody alerts awaiting action</h2>
        </div>
      </header>

      {loading && <p>Loading alerts...</p>}
      {!loading && alerts.length === 0 && (
        <p>All custody alerts are up to date.</p>
      )}

      <div className="grid">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            footer={
              <PoliceUpdateForm
                initial={{
                  custodyStatus: alert.custodyStatus,
                  healthStatus: alert.healthStatus,
                  courtProduction: alert.courtProduction,
                  status: alert.status,
                }}
                disabled={updating === alert.id}
                onSubmit={(payload) => handleUpdate(alert.id, payload)}
              />
            }
          />
        ))}
      </div>
    </section>
  );
};

const PoliceUpdateForm = ({ initial, onSubmit, disabled }) => {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <label className="field">
        <span>Custody status</span>
        <input value={form.custodyStatus} onChange={update("custodyStatus")} />
      </label>
      <label className="field">
        <span>Health status</span>
        <input value={form.healthStatus} onChange={update("healthStatus")} />
      </label>
      <label className="field">
        <span>24h Court production</span>
        <input
          value={form.courtProduction}
          onChange={update("courtProduction")}
        />
      </label>
      <label className="field">
        <span>Status</span>
        <select value={form.status} onChange={update("status")}>
          <option value="open">Open</option>
          <option value="in-custody">In custody</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <button className="primary" type="submit" disabled={disabled}>
        {disabled ? "Saving..." : "Update custody record"}
      </button>
    </form>
  );
};

