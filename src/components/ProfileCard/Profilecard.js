import "./Profilecard.css";
import RelationshipChart from "../RelationshipChart/RelationshipChart";
import TraitsChart from "../TraitsChart/TraitsChart";
import { addTech, removeTech } from "../../supabaseClient.js";

export default function ProfileCard({
	age,
	techIntroduced,
	onIntroduce,
	onRemove,
	selectedPetr,
	relationships,
	stats,
	relationshipsLoading,
	statsLoading,
}) {
	const NAMES = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];
	const TABLES = ["person_A", "person_B", "person_C", "person_D", "person_E"];
	const NAME_TO_TABLE = Object.fromEntries(
		NAMES.map((name, i) => [name, TABLES[i]]),
	);

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
				<RelationshipChart
					selectedPetr={selectedPetr}
					relationships={relationships}
					loading={relationshipsLoading}
				/>
			</div>

			{/* Row 3 — Traits Chart */}
			<div className="profile-section">
				<p className="profile-section-label">Traits</p>
				<TraitsChart
					stats={stats}
					loading={statsLoading}
				/>
			</div>

			{/* Action buttons */}
			<div className="profile-actions">
				<button
					className="profile-btn profile-btn--introduce"
					onClick={() => {
						onIntroduce();
						addTech(NAME_TO_TABLE[selectedPetr], age);
					}}
					disabled={techIntroduced}
				>
					Introduce Tech
				</button>
				<button
					className="profile-btn profile-btn--remove"
					onClick={() => {
						onRemove();
						removeTech(NAME_TO_TABLE[selectedPetr], age);
					}}
					disabled={!techIntroduced}
				>
					Remove Tech
				</button>
			</div>
		</div>
	);
}
