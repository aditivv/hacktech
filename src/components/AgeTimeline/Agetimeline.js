import "./Agetimeline.css";

const MILESTONES = new Set([6, 12, 18, 24]);

export default function AgeTimeline({ ages, currentAge, onAgeDown, onAgeUp }) {
  const currentIndex = ages.indexOf(currentAge);
  const pct = (currentIndex / (ages.length - 1)) * 100;

  return (
    <div className="timeline-wrapper">
      <button
        className="timeline-btn"
        onClick={onAgeDown}
        disabled={currentIndex === 0}
        aria-label="Age down"
      >
        age down
      </button>

      <div className="timeline-track-container">
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${pct}%` }} />

          {ages.map((age, i) => {
            const pos       = (i / (ages.length - 1)) * 100;
            const isActive  = age === currentAge;
            const isPast    = age < currentAge;
            const isMilestone = MILESTONES.has(age);

            return (
              <div
                key={age}
                className={[
                  "timeline-node",
                  isActive    && "timeline-node--active",
                  isPast      && "timeline-node--past",
                  isMilestone && "timeline-node--milestone",
                ].filter(Boolean).join(" ")}
                style={{ left: `${pos}%` }}
              >
                {isMilestone && (
                  <span className="timeline-node-label">{age}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="timeline-btn"
        onClick={onAgeUp}
        disabled={currentIndex === ages.length - 1}
        aria-label="Age up"
      >
        age up
      </button>
    </div>
  );
}