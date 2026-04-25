import "./Socialgraph.css";
import ipadKid  from "../../assets/ipad_cropped.png";
import normalKid from "../../assets/normal_cropped.png";

const GRAPH = {
  nodes: [
    { id: 0, x: 200, y: 60,  label: "Petr 1" },
    { id: 1, x: 80,  y: 160, label: "Petr 2" },
    { id: 2, x: 320, y: 160, label: "Petr 3" },
    { id: 3, x: 110, y: 290, label: "Petr 4" },
    { id: 4, x: 290, y: 290, label: "Petr 5" },
  ],
  edges: [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]],
};

export default function SocialGraph({ age, techIntroduced, setSelectedPetr, selectedPetr, techPetrs }) {
  return (
    <div className="graph-wrapper">
      <p className="graph-label">Social Network — Age {age}</p>
      <svg
        className="graph-svg"
        viewBox="0 0 400 440"
        xmlns="http://www.w3.org/2000/svg"
      >
        {GRAPH.edges.map(([a, b], i) => {
          const na = GRAPH.nodes[a];
          const nb = GRAPH.nodes[b];
          return (
            <line
              key={i}
              className="graph-edge"
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
            />
          );
        })}

        {GRAPH.nodes.map((n) => {
          const size       = 22;
          const isSelected = n.label === selectedPetr;
          const hasTech    = techPetrs?.has(n.label);
          const src        = hasTech ? ipadKid : normalKid;

          return (
            <g
              key={n.id}
              className={`graph-node-group ${isSelected ? "graph-node-group--selected" : ""}`}
              onClick={() => setSelectedPetr(n.label)}
            >
              <image
                href={src}
                x={n.x - size}
                y={n.y - size}
                width={size * 2}
                height={size * 2}
                className="graph-node-img"
              />
              <text
                x={n.x} y={n.y + size + 14}
                className="graph-node-label"
                textAnchor="middle"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}