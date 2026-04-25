// RelationshipChart.jsx
import "./RelationshipChart.css";

const getStatus = (value) => {
  if (value >= 80) return "Close Friends";
  if (value >= 60) return "Friends";
  if (value >= 40) return "Acquainted";
  if (value >= 20) return "Distant";
  return "Bad Terms";
};

const getStatusClass = (value) => {
  if (value >= 80) return "bar--close";
  if (value >= 60) return "bar--friends";
  if (value >= 40) return "bar--acquainted";
  if (value >= 20) return "bar--distant";
  return "bar--bad";
};

export default function RelationshipChart({ selectedPetr, friends }) {
  const others = friends.filter((f) => f.name !== selectedPetr);

  return (
    <div className="rel-chart">
      {others.map((f) => (
        <div className="rel-row" key={f.name}>
          <div className="rel-header">
            <span className="rel-name">{f.name}</span>
            <span className="rel-status">{getStatus(f.relationship)}</span>
          </div>
          <div className="rel-track">
            <div
              className={`rel-bar ${getStatusClass(f.relationship)}`}
              style={{ width: `${f.relationship}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}