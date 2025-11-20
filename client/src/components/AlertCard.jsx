import { StatusBadge } from "./StatusBadge";

export const AlertCard = ({ alert, footer }) => {
  return (
    <div className="card alert-card">
      <div className="alert-card__header">
        <div>
          <h4>{alert.personName}</h4>
          <p className="muted">{alert.relationToCitizen || "—"}</p>
        </div>
        <StatusBadge status={alert.status} escalated={alert.escalated} />
      </div>
      <dl className="alert-details">
        <div>
          <dt>Custody status</dt>
          <dd>{alert.custodyStatus}</dd>
        </div>
        <div>
          <dt>Health status</dt>
          <dd>{alert.healthStatus}</dd>
        </div>
        <div>
          <dt>Court production</dt>
          <dd>{alert.courtProduction}</dd>
        </div>
      </dl>
      <p>{alert.incidentDetails}</p>
      {alert.escalated && (
        <p className="escalated-note">
          Escalated {alert.escalationReason && `— ${alert.escalationReason}`}
        </p>
      )}
      {footer && <div className="alert-card__footer">{footer}</div>}
    </div>
  );
};

