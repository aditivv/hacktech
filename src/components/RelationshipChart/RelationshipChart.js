// RelationshipChart.jsx
import "./RelationshipChart.css";
import iPad from "../../assets/ipad_cropped.png"
import Normal from "../../assets/normal_cropped.png"

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

const SKELETON_ROWS = [1, 2, 3, 4];

export default function RelationshipChart({ relationships, loading, selectedPetr }) {
  const NAMES = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];
  const others = NAMES.filter((n) => n !== selectedPetr);

  if (loading) {
    return (
      <div className="rel-chart">
        {[1,2,3,4].map((i) => (
          <div className="rel-row" key={i}>
            <div className="rel-header">
              <span className="rel-name-skeleton" />
              <span className="rel-status-skeleton" />
            </div>
            <div className="rel-track">
              <div className="rel-bar-skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!relationships || Object.keys(relationships).length === 0) {
    return <div className="rel-chart">Click a Petr to load relationships.</div>;
  }

  const entries = Object.values(relationships); // [85, 60, 40, 20]

  return (
    <div className="rel-chart">
      {others.map((name, i) => {
        const value = entries[i] ?? 0;
        return (
          <div className="rel-row" key={name}>
            <div className="rel-header">
              <span className="rel-name">{name}</span>
              <span className="rel-status">{getStatus(value)}</span>
            </div>
            <div className="rel-track">
              <div
                className={`rel-bar ${getStatusClass(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}