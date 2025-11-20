const labelMap = {
  open: "Open",
  "in-custody": "In custody",
  escalated: "Escalated",
  "legal-review": "Legal review",
  closed: "Closed",
};

export const StatusBadge = ({ status, escalated }) => {
  const label = labelMap[status] || status;
  return (
    <span className={`status-badge status-${status}`}>
      {label}
      {escalated && status !== "closed" && <span className="pulse" />}
    </span>
  );
};

