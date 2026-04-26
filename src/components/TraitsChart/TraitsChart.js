// TraitsChart.jsx
import "./TraitsChart.css";

const DISPLAY_NAMES = {
  confidence: "Confidence",
  attention_span: "Attention Span",
  irritability: "Irritability",
  impulsivity: "Impulsivity",
  adaptability: "Adaptability",
};

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

export default function TraitsChart({ stats, loading }) {
  if (loading || !stats || Object.keys(stats).length === 0) {
    return (
      <div className="traits-chart">
        {[1,2,3,4,5].map(i => (
          <div className="traits-row" key={i}>
            <div className="traits-header">
              <span className="traits-name-skeleton" />
              <span className="traits-status-skeleton" />
            </div>
            <div className="traits-track">
              <div className="trait-bar-skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="traits-chart">
      {Object.entries(stats).map(([key, value]) => {
        const safeValue = value ?? 100;  // ← fallback to 100 if null
        return (
          <div className="traits-row" key={key}>
            <div className="traits-header">
              <span className="traits-name">{DISPLAY_NAMES[key] ?? key}</span>
              <span className="traits-status">{getStatus(safeValue)}</span>
            </div>
            <div className="traits-track">
              <div
                className={`traits-bar ${getStatusClass(safeValue)}`}
                style={{ width: `${safeValue}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}