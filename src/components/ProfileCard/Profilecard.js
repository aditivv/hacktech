import "./Profilecard.css";
import RelationshipChart from "../RelationshipChart/RelationshipChart";
import TraitsChart from "../TraitsChart/TraitsChart";

export default function ProfileCard({ age, techIntroduced, onIntroduce, onRemove, selectedPetr }) {
  const FRIENDS = [{ name: "Petr 1", relationship: 100 },
                  { name: "Petr 2", relationship: 100 },
                  { name: "Petr 3", relationship: 100 },
                  { name: "Petr 4", relationship: 100 },
                  { name: "Petr 5", relationship: 100 }];
  const TRAITS = { "Confidence": 100, "Attention Span": 100, "Irritability": 100, "Impulsivity": 100, "Adaptability": 100}

  return (
    <div className="profile-card">

      {/* Row 1 — Name and Age */}
      <div className="profile-section">
        <div className="profile-table-header">
          <span>Name</span>
          <span>Age</span>
        </div>
        <div className="profile-table-row">
          <span className="profile-name">{selectedPetr}</span>
          <span className="profile-age-badge">{age}</span>
        </div>
      </div>

      {/* Row 2 — Relationship Chart */}
      <div className="profile-section">
        <p className="profile-section-label">Relationships</p>
        <RelationshipChart selectedPetr={selectedPetr} friends={FRIENDS} />
      </div>

      {/* Row 3 — Traits Chart */}
      <div className="profile-section">
        <p className="profile-section-label">Traits</p>
        <TraitsChart traits={TRAITS} />
      </div>

      {/* Action buttons */}
      <div className="profile-actions">
        <button
          className="profile-btn profile-btn--introduce"
          onClick={onIntroduce}
          disabled={techIntroduced}
        >
          Introduce Tech
        </button>
        <button
          className="profile-btn profile-btn--remove"
          onClick={onRemove}
          disabled={!techIntroduced}
        >
          Remove Tech
        </button>
      </div>

    </div>
  );
}