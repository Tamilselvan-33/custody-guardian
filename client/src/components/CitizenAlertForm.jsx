import { useState } from "react";

const initialState = {
  personName: "",
  relationToCitizen: "",
  lastSeenLocation: "",
  incidentDetails: "",
};

export const CitizenAlertForm = ({ onSubmit, submitting }) => {
  const [form, setForm] = useState(initialState);

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form).then(() => setForm(initialState));
  };

  return (
    <form className="stack card" onSubmit={handleSubmit}>
      <h3>Raise Custody Alert</h3>
      <label className="field">
        <span>Person in custody / missing</span>
        <input
          value={form.personName}
          onChange={update("personName")}
          placeholder="Full name"
          required
        />
      </label>
      <label className="field">
        <span>Relation to you</span>
        <input
          value={form.relationToCitizen}
          onChange={update("relationToCitizen")}
          placeholder="Brother, friend, neighbor..."
        />
      </label>
      <label className="field">
        <span>Last known location</span>
        <input
          value={form.lastSeenLocation}
          onChange={update("lastSeenLocation")}
          placeholder="Station / locality"
        />
      </label>
      <label className="field">
        <span>Incident details</span>
        <textarea
          value={form.incidentDetails}
          onChange={update("incidentDetails")}
          placeholder="Describe arrest circumstances, health, witnesses..."
          rows={4}
          required
        />
      </label>
      <button className="primary" type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit alert"}
      </button>
    </form>
  );
};

