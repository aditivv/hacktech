import { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, ReferenceDot } from "recharts";
import "./PetrComparison.css";
import Supabase, { getConfidence, getAdaptability, getAttentionSpan, getImpulsivity, getIrritability } from "../../supabaseClient.js";

const PETRS = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];
const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

const STATS = [
  { key: "confidence",   label: "Confidence" },
  { key: "attention",    label: "Attention" },
  { key: "adaptability", label: "Adaptability" },
  { key: "impulsivity",  label: "Impulsivity",  inverted: true },
  { key: "irritability", label: "Irritability", inverted: true },
];

function seedFor(petr, statKey) {
  let h = 0;
  const s = petr + statKey;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 1000 / 1000;
}

function buildSeries(petr, statKey, isTech, inverted, currentAge) {
  const seed = seedFor(petr, statKey);
  const base = 55 + seed * 25;
  return AGES.filter((a) => a <= currentAge).map((age) => {
    const drift = Math.sin(age * 0.4 + seed * 6) * 4;
    const techPenalty = isTech ? Math.min((age - 6) * 1.6, 22) : 0;
    const raw = base + drift + (inverted ? techPenalty : -techPenalty);
    return { age, value: Math.max(10, Math.min(95, raw)) };
  });
}

export default function PetrComparison({
  techPetrs,
  selectedPetr,
  setSelectedPetr,
  currentAge,
}) {
  const rows = useMemo(() => {
  return PETRS.map((petr) => {
    const isTech = techPetrs.has(petr);
    const stats = STATS.map((s) => ({
      ...s,
      data: buildSeries(petr, s.key, isTech, s.inverted, currentAge),
    }));
    return { petr, isTech, stats };
  });
}, [techPetrs, currentAge]);

  return (
    <section className="petr-comparison">
      <header className="comparison-header">
        <span className="comparison-eyebrow">Cross-section · age {currentAge}</span>
        <h3 className="comparison-title">All Petrs, side by side</h3>
        <p className="comparison-sub">
          Each row is one Petr, displaying each of its stats numerically side by side with the other Petrs for easy comparison.
        </p>
      </header>

      <div className="comparison-grid">
        <div className="comparison-grid-head">
            <span />
            {STATS.map((s) => (
                <span key={s.key} className="col-label">{s.label}</span>
            ))}
        </div>


        {rows.map(({ petr, isTech, stats }) => (
          <button
            key={petr}
            type="button"
            onClick={() => setSelectedPetr(petr)}
            className={`comparison-row ${isTech ? "tech" : ""} ${selectedPetr === petr ? "selected" : ""}`}
          >
            <div className="row-id">
              <span className="row-petr">{petr}</span>
              <span className="row-tag">{isTech ? "tech" : "tech-free"}</span>
            </div>

            {stats.map((s) => {
              const last = s.data[s.data.length - 1];
              return (
                <div key={s.key} className="spark-cell">
                  <div className="spark-value">{Math.round(last?.value ?? 0)}</div>
                  <ResponsiveContainer width="100%" height={36}>
                    <LineChart data={s.data} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        cursor={{ stroke: "var(--border)", strokeDasharray: "2 3" }}
                        contentStyle={{
                          background: "var(--paper)",
                          border: "1px solid var(--ink)",
                          borderRadius: 4,
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          padding: "4px 8px",
                        }}
                        formatter={(v) => [Math.round(v), s.label]}
                        labelFormatter={(age) => `age ${age}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isTech ? "var(--accent)" : "var(--ink)"}
                        strokeWidth={1.6}
                        dot={false}
                        isAnimationActive={false}
                      />
                      {last && (
                        <ReferenceDot
                          x={last.age}
                          y={last.value}
                          r={3}
                          fill={isTech ? "var(--accent)" : "var(--ink)"}
                          stroke="var(--paper)"
                          strokeWidth={1.5}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </button>
        ))}
      </div>

      <p className="comparison-footnote">
        Click any row to focus that Petr in the simulator above.
      </p>
    </section>
  );
}
