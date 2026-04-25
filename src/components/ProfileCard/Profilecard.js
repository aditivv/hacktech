import "./Profilecard.css";
import RelationshipChart from "../RelationshipChart/RelationshipChart";

export default function ProfileCard({ age, techIntroduced, onIntroduce, onRemove, selectedPetr }) {
  const FRIENDS = [{ name: "Petr 1", relationship: 100 },
                  { name: "Petr 2", relationship: 100 },
                  { name: "Petr 3", relationship: 100 },
                  { name: "Petr 4", relationship: 100 },
                  { name: "Petr 5", relationship: 100 }];
  const TRAITS = ["Confidence", "Attention Span", "Irritability", "Impulsivity", "Adaptability"]

  return (
    <div className="profile-card">
      {/* Name / Friends / Traits table */}
      <div className="profile-table">
        <div className="profile-table-header">
          <span>Name</span>
          <span>Friends</span>
        </div>

        {FRIENDS.map((f, i) => (
          <div className="profile-table-row" key={f.name}>
            <span className="profile-name">{i === 0 ? selectedPetr : ""}</span>
            <span className="profile-friend">{selectedPetr === f.name ? "" : f.name}</span>
          </div>
        ))}
      </div>

      {/* About me */}
      <div className="profile-about">
        <p className="profile-about-label">Relationship Chart</p>
        <RelationshipChart selectedPetr={selectedPetr} friends={FRIENDS} />
        <p className="profile-about-label">About Me</p>
        <p className="profile-about-text">placeholder</p>
        {techIntroduced && (
          <span className="profile-tech-badge">Tech introduced</span>
        )}
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