import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CitizenAlertForm } from "../components/CitizenAlertForm";
import { AlertCard } from "../components/AlertCard";
import { useAlertsChannel } from "../hooks/useAlertsChannel";

export const CitizenDashboard = () => {
  const { user, request } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchAlerts = useCallback(async () => {
    const data = await request("/api/alerts/mine");
    setAlerts(data);
    setLoading(false);
  }, [request]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useAlertsChannel((event) => {
    if (event?.alert?.citizen !== user?.id) return;
    setAlerts((prev) => {
      const others = prev.filter((a) => a.id !== event.alert.id);
      return [event.alert, ...others];
    });
  });

  const handleCreate = async (payload) => {
    setCreating(true);
    try {
      const data = await request("/api/alerts", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setAlerts((prev) => [data, ...prev]);
    } finally {
      setCreating(false);
    }
  };

  const metrics = useMemo(() => {
    const total = alerts.length;
    const escalated = alerts.filter((a) => a.escalated).length;
    const resolved = alerts.filter((a) => a.status === "closed").length;
    return { total, escalated, resolved };
  }, [alerts]);

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="muted">Citizen dashboard</p>
          <h2>Hi {user.fullName.split(" ")[0]}, track custody status 24/7</h2>
        </div>
        <div className="metrics">
          <div>
            <span>Total alerts</span>
            <strong>{metrics.total}</strong>
          </div>
          <div>
            <span>Escalated</span>
            <strong>{metrics.escalated}</strong>
          </div>
          <div>
            <span>Closed</span>
            <strong>{metrics.resolved}</strong>
          </div>
        </div>
      </header>

      <CitizenAlertForm onSubmit={handleCreate} submitting={creating} />

      <div className="grid">
        {loading && <p>Loading alerts...</p>}
        {!loading && alerts.length === 0 && (
          <p>No alerts yet. Submit your first custody alert above.</p>
        )}
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  );
};

