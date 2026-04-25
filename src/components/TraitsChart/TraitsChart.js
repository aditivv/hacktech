// TraitsChart.jsx
import "./TraitsChart.css";

const getStatus = (value) => {
  if (value >= 80) return "Very High";
  if (value >= 60) return "High";
  if (value >= 40) return "Moderate";
  if (value >= 20) return "Low";
  return "Very Low";
};

const getStatusClass = (value) => {
  if (value >= 80) return "trait-bar--veryhigh";
  if (value >= 60) return "trait-bar--high";
  if (value >= 40) return "trait-bar--moderate";
  if (value >= 20) return "trait-bar--low";
  return "trait-bar--verylow";
};

export default function TraitsChart({ traits }) {
  return (
    <div className="traits-chart">
      {Object.entries(traits).map(([name, value]) => (
        <div className="traits-row" key={name}>
          <div className="traits-header">
            <span className="traits-name">{name}</span>
            <span className="traits-status">{getStatus(value)}</span>
          </div>
          <div className="traits-track">
            <div
              className={`traits-bar ${getStatusClass(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}