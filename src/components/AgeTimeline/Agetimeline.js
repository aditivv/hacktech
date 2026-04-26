import { useState } from "react";
import "./Agetimeline.css";
import {
	updatePerson,
	getConfidence,
	getAdaptability,
	getAttentionSpan,
	getImpulsivity,
	getIrritability,
	getAgeTechIntro,
	getTechStatus,
} from "../../supabaseClient.js";

const MILESTONES = new Set([6, 12, 18, 24]);
const TABLES = ["person_A", "person_B", "person_C", "person_D", "person_E"];

export default function AgeTimeline({ ages, currentAge, onAgeDown, onAgeUp }) {
	const currentIndex = ages.indexOf(currentAge);
	const pct = (currentIndex / (ages.length - 1)) * 100;

	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const createStats = async (table, age) => {
		const confidence = await getConfidence(table, age);
		const adaptability = await getAdaptability(table, age);
		const attention_span = await getAttentionSpan(table, age);
		const impulsivity = await getImpulsivity(table, age);
		const irritability = await getIrritability(table, age);

		return {
			confidence,
			adaptability,
			attention_span,
			impulsivity,
			irritability,
		};
	};

	const ageUp = async () => {
		setLoading(true);
		setProgress(0);

		for (let i = 0; i < TABLES.length; i++) {
			const age_tech_intro = await getAgeTechIntro(TABLES[i], currentAge);
			const tech = await getTechStatus(TABLES[i], currentAge);
			const stats = await createStats(TABLES[i], currentAge);
			let res;

			if (tech === true) {
				try {
					const request = await fetch("http://localhost:8001/age_ipad_kid", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							age: currentAge,
							age_tech_intro: age_tech_intro,
							stats: stats,
						}),
					});

					res = await request.json();
					console.log(res);
				} catch (err) {
					console.error("Error: ", err);
				}
			} else {
				try {
					const request = await fetch("http://localhost:8001/age_normal_kid", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							age: currentAge,
							stats: stats,
						}),
					});

					res = await request.json();
					console.log(res);
				} catch (err) {
					console.error("Error: ", err);
				}
			}

			updatePerson(
				TABLES[i],
				currentAge + 1,
				res["confidence"],
				res["attention_span"],
				res["irritability"],
				res["impulsivity"],
				res["adaptability"],
			);
			setProgress(i + 1);
		}

		setLoading(false);
		onAgeUp();
	};

	return (
		<div className="timeline-wrapper">
			<button
				className="timeline-btn"
				onClick={onAgeDown}
				disabled={currentIndex === 0 || loading}
				aria-label="Age down"
			>
				age down
			</button>

			<div className="timeline-track-container">
				{loading && (
					<div className="loading-bar-wrapper">
						<div className="loading-label">
							Simulating person {progress} / {TABLES.length}...
						</div>
						<div className="loading-track">
							<div
								className="loading-fill"
								style={{ width: `${(progress / TABLES.length) * 100}%` }}
							/>
						</div>
					</div>
				)}

				<div className="timeline-track">
					<div
						className="timeline-fill"
						style={{ width: `${pct}%` }}
					/>

					{ages.map((age, i) => {
						const pos = (i / (ages.length - 1)) * 100;
						const isActive = age === currentAge;
						const isPast = age < currentAge;
						const isMilestone = MILESTONES.has(age);

						return (
							<div
								key={age}
								className={[
									"timeline-node",
									isActive && "timeline-node--active",
									isPast && "timeline-node--past",
									isMilestone && "timeline-node--milestone",
								]
									.filter(Boolean)
									.join(" ")}
								style={{ left: `${pos}%` }}
							>
								{isMilestone && <span className="timeline-node-label">{age}</span>}
							</div>
						);
					})}
				</div>
			</div>

			<button
				className="timeline-btn"
				onClick={ageUp}
				disabled={currentIndex === ages.length - 1 || loading}
				aria-label="Age up"
			>
				{loading ? `simulating... (${progress}/${TABLES.length})` : "age up"}
			</button>
		</div>
	);
}
