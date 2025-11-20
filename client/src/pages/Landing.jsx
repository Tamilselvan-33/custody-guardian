import { Link } from "react-router-dom";

const roleCards = [
  {
    role: "Citizen",
    description:
      "Families and friends can raise Custody Alerts the moment someone is detained or missing, track every update, and stay informed.",
    cta: "Citizen workspace",
    path: "/citizen",
  },
  {
    role: "Police",
    description:
      "Stations receive structured dashboards to log custody, welfare, and court production every time an alert arrives.",
    cta: "Police login",
    path: "/police",
  },
  {
    role: "Lawyer",
    description:
      "Duty counsels view auto-escalated cases, record legal steps, and keep citizens notified of court progress.",
    cta: "Lawyer login",
    path: "/lawyer",
  },
];

export const Landing = () => (
  <main className="landing">
    <section className="hero card">
      <div>
        <p className="hero-kicker">24-hour custody accountability</p>
        <h1>Raise alerts, track welfare, escalate automatically</h1>
        <p>
          Custody Guardian gives families, police control rooms, and legal defenders the same
          source of truth. Every arrest is logged, every update is timed, and nothing falls through.
        </p>
      </div>
      <ul>
        <li>File Custody Alerts instantly when a person is detained or missing.</li>
        <li>Police dashboards enforce welfare updates and 24-hour court production.</li>
        <li>Legal teams are auto-notified if police stay silent past the deadline.</li>
        <li>Every action is timestamped for transparent, tamper-proof audit trails.</li>
      </ul>
    </section>

    <section className="role-grid">
      {roleCards.map((card) => (
        <div key={card.role} className="card role-card">
          <p className="muted role-kicker">{card.role} workspace</p>
          <h3>{card.role}</h3>
          <p>{card.description}</p>
          <Link className="link-btn" to={card.path}>
            {card.cta}
          </Link>
        </div>
      ))}
    </section>
  </main>
);

