import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";
import "./PetrComparison.css";
import Supabase, { getConfidence, getAdaptability, getAttentionSpan, getImpulsivity, getIrritability } from "../../supabaseClient.js";

const PETRS = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];
const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

const PETR_TO_TABLE = {
  "Petr 1": "person_A",
  "Petr 2": "person_B",
  "Petr 3": "person_C",
  "Petr 4": "person_D",
  "Petr 5": "person_E",
};

const STATS = [
  { key: "confidence",   label: "Confidence",   getter: getConfidence },
  { key: "attention",    label: "Attention",    getter: getAttentionSpan },
  { key: "adaptability", label: "Adaptability", getter: getAdaptability },
  { key: "impulsivity",  label: "Impulsivity",  getter: getImpulsivity,  inverted: true },
  { key: "irritability", label: "Irritability", getter: getIrritability, inverted: true },
];

async function fetchSeries(petr, stat, currentAge) {
  const table = PETR_TO_TABLE[petr];
  const ages = AGES.filter((a) => a <= currentAge);
  const values = await Promise.all(
    ages.map(async (age) => {
      try {
        const value = await stat.getter(table, age);
        return { age, value: Number(value) };
      } catch {
        return null;
      }
    })
  );
  return values.filter((v) => v !== null && Number.isFinite(v.value));
}

export default function PetrComparison({
  techPetrs,
  selectedPetr,
  setSelectedPetr,
  currentAge,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const built = await Promise.all(
        PETRS.map(async (petr) => {
          const isTech = techPetrs.has(petr);
          const stats = await Promise.all(
            STATS.map(async (s) => ({
              ...s,
              data: await fetchSeries(petr, s, currentAge),
            }))
          );
          return { petr, isTech, stats };
        })
      );
      if (!cancelled) {
        setRows(built);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
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

        {loading && rows.length === 0 ? (
          <div className="comparison-loading">Loading live data…</div>
        ) : (
          rows.map(({ petr, isTech, stats }) => (
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
                    <div className="spark-value">{last ? Math.round(last.value) : "—"}</div>
                    <ResponsiveContainer width="100%" height={36}>
                      <LineChart data={s.data} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
                        <XAxis dataKey="age" hide type="number" domain={[6, "dataMax"]} />
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
          ))
        )}
      </div>

      <p className="comparison-footnote">
        Click any row to focus that Petr in the simulator above.
      </p>
    </section>
  );
}
