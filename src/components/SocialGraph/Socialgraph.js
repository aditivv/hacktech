import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Socialgraph.css";
import iPad from "../../assets/ipad_cropped.png";
import Normal from "../../assets/normal_cropped.png";

const PETRS = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];

// Deterministic position per Petr per age — feels organic but stable
function getPosition(petr, age, techIntroduced, isTech) {
  const i = PETRS.indexOf(petr);
  const angle = (i / PETRS.length) * Math.PI * 2 + age * 0.08;
  const baseRadius = 130;
  // Tech petrs drift outward as they age — isolation metaphor
  const radius = isTech
    ? baseRadius + (age - 6) * 4
    : baseRadius + Math.sin(age * 0.5 + i) * 12;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export default function SocialGraph({
  age,
  techPetrs,
  selectedPetr,
  setSelectedPetr,
}) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Parallax tilt — pseudo-3D
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      className="social-graph-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="social-graph-scene"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      >
        {/* Edges (drawn first, behind nodes) */}
        <svg className="social-graph-edges" viewBox="-200 -200 400 400">
          {PETRS.map((petr) => {
            if (petr === selectedPetr) return null;
            const isTech = techPetrs.has(petr);
            const selectedIsTech = techPetrs.has(selectedPetr);
            const a = getPosition(selectedPetr, age, true, selectedIsTech);
            const b = getPosition(petr, age, true, isTech);
            // Edge weakens for tech petrs over time
            const strength =
              isTech || selectedIsTech
                ? Math.max(0.15, 1 - (age - 6) * 0.05)
                : 0.85;
            return (
              <motion.line
                key={petr}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={
                  isTech || selectedIsTech ? "var(--accent)" : "var(--ink-muted)"
                }
                strokeWidth={strength * 2}
                strokeOpacity={strength}
                strokeDasharray={isTech || selectedIsTech ? "4 6" : "0"}
                initial={false}
                animate={{
                  x1: a.x,
                  y1: a.y,
                  x2: b.x,
                  y2: b.y,
                  strokeOpacity: strength,
                }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {PETRS.map((petr) => {
          const isTech = techPetrs.has(petr);
          const isSelected = petr === selectedPetr;
          const pos = getPosition(petr, age, true, isTech);
          const nodeImage = isTech ? iPad : Normal;

          return (
            <motion.button
              key={petr}
              className={`graph-node ${isSelected ? "selected" : ""} ${
                isTech ? "tech" : ""
              }`}
              onClick={() => setSelectedPetr(petr)}
              initial={false}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: isSelected ? 1.25 : 1,
              }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              whileHover={{ scale: isSelected ? 1.3 : 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={nodeImage}
                alt={isTech ? "Tech petr" : "Petr"}
                className="node-image"
                draggable={false}
              />
              <span className="node-label">{petr.replace("Petr ", "P")}</span>
            </motion.button>
          );
        })}

        {/* Center "self" indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPetr + age}
            className="graph-center-label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <span className="center-petr">{selectedPetr}</span>
            <span className="center-age">age {age}</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}