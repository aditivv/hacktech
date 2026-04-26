import { useState, useEffect, useRef } from "react";
import ProfileCard from "./components/ProfileCard/Profilecard.js";
import SocialGraph from "./components/SocialGraph/Socialgraph.js";
import AgeTimeline from "./components/AgeTimeline/Agetimeline.js";
import ConfirmModal from "./components/ConfirmModal/Confirmmodal.js";
import {
	addPerson,
	getConfidence,
	getAdaptability,
	getAttentionSpan,
	getImpulsivity,
	getIrritability,
} from "./supabaseClient.js";
import "./App.css";
import ScrollRevealSection from "./ScrollRevealSection.js";
import PetrComparison from "./components/PetrComparison/PetrComparison.js";

const AGES = [
	6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];
const NAMES = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"];
const TABLES = ["person_A", "person_B", "person_C", "person_D", "person_E"];
const NAME_TO_TABLE = Object.fromEntries(
	NAMES.map((name, i) => [name, TABLES[i]]),
);

export default function App() {
	const [currentAge, setCurrentAge] = useState(6);
	const [techPetrs, setTechPetrs] = useState(new Set());
	const [pendingAction, setPendingAction] = useState(null); // { type: 'introduce' | 'remove', age }
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedPetr, setSelectedPetr] = useState("Petr 1");
	const [relationships, setRelationships] = useState({});
	const [relationshipsLoading, setRelationshipsLoading] = useState(false);
	const [statsLoading, setStatsLoading] = useState(false);
	const [showComparison, setShowComparison] = useState(false);
	const [stats, setStats] = useState({});
	const relationshipsCache = useRef({});
	const statsCache = useRef({});

	const currentIndex = AGES.indexOf(currentAge);

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

	const fetchStats = async (name, age) => {
		const cacheKey = `${name}-${age}`;

		if (statsCache.current[cacheKey]) {
			setStats(statsCache.current[cacheKey]);
			return;
		}
		setStatsLoading(true);
		const s = await createStats(NAME_TO_TABLE[name], age);
		statsCache.current[cacheKey] = s;
		setStats(s);
		setStatsLoading(false);
	};

	useEffect(() => {
		const init = async () => {
			for (let i = 0; i < TABLES.length; i++) {
				await addPerson(NAMES[i], TABLES[i]); // ← await each one
			}
			const s = await createStats(NAME_TO_TABLE["Petr 1"], 6);
			statsCache.current["Petr 1-6"] = s;
			setStats(s);
		};
		init();
	}, []);

	const changeRelationships = async (petr, age) => {
		const cacheKey = `${petr}-${age}`;

		if (relationshipsCache.current[cacheKey]) {
			setRelationships(relationshipsCache.current[cacheKey]);
			return;
		}

		setRelationshipsLoading(true);

		const filtered = Object.fromEntries(
			Object.entries(NAME_TO_TABLE).filter(([key]) => key !== petr),
		);
		const values = Object.values(filtered);

		const petr1Stats = await createStats(NAME_TO_TABLE[petr], age);
		const petr2Stats = await createStats(values[0], age);
		const petr3Stats = await createStats(values[1], age);
		const petr4Stats = await createStats(values[2], age);
		const petr5Stats = await createStats(values[3], age);

		const request = await fetch("http://localhost:8001/relationship", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				petr1: petr1Stats,
				petr2: petr2Stats,
				petr3: petr3Stats,
				petr4: petr4Stats,
				petr5: petr5Stats,
			}),
		});

		const res = await request.json();
		relationshipsCache.current[cacheKey] = res;
		setRelationships(res);
		setRelationshipsLoading(false); // ← was missing
	};

	const handleAgeDown = () => {
		if (currentIndex > 0) setCurrentAge(AGES[currentIndex - 1]);
	};

	const handleAgeUp = () => {
		if (currentIndex < AGES.length - 1) {
			relationshipsCache.current = {};
			statsCache.current = {}; // ← clear stats cache too
			setCurrentAge(AGES[currentIndex + 1]);
		}
	};

	const handleSelectPetr = async (name) => {
		setSelectedPetr(name);
		await Promise.all([
			fetchStats(name, currentAge),
			changeRelationships(name, currentAge),
		]);
	};

	const handleIntroduce = () => {
		setPendingAction({ type: "introduce", age: currentAge });
		setModalOpen(true);
	};

	const handleRemove = () => {
		setPendingAction({ type: "remove", age: currentAge });
		setModalOpen(true);
	};

	const handleConfirm = () => {
		if (pendingAction?.type === "introduce") {
			setTechPetrs((prev) => new Set([...prev, selectedPetr]));
		}
		if (pendingAction?.type === "remove") {
			setTechPetrs((prev) => {
				const next = new Set(prev);
				next.delete(selectedPetr);
				return next;
			});
		}
		setModalOpen(false);
		setPendingAction(null);
	};

	const handleCancel = () => {
		setModalOpen(false);
		setPendingAction(null);
	};

	return (
		<div className="app">
			<header className="app-header">
				<span className="app-title">Screenbound</span>
				<span className="app-subtitle">Simulate screenagers.</span>
			</header>

			<main className="app-layout">
				<aside className="left-panel">
					<ProfileCard
						age={currentAge}
						techIntroduced={techPetrs.has(selectedPetr)}
						onIntroduce={handleIntroduce}
						onRemove={handleRemove}
						selectedPetr={selectedPetr}
						relationships={relationships}
						stats={stats}
						relationshipsLoading={relationshipsLoading}
						statsLoading={statsLoading}
					/>
				</aside>

				<section className="center-panel">
					<SocialGraph
						age={currentAge}
						techIntroduced={techPetrs.has(selectedPetr)}
						techPetrs={techPetrs}
						selectedPetr={selectedPetr}
						setSelectedPetr={handleSelectPetr}
					/>
				</section>
			</main>

			<footer className="bottom-panel">
				<AgeTimeline
					ages={AGES}
					currentAge={currentAge}
					onAgeDown={handleAgeDown}
					onAgeUp={handleAgeUp}
				/>
				<div className="comparison-toggle-wrap">
					<button
						type="button"
						className={`comparison-pill ${showComparison ? "open" : ""}`}
						onClick={() => setShowComparison((s) => !s)}
						aria-expanded={showComparison}
						aria-controls="petr-comparison-panel"
					>
						<span
							className="pill-dot"
							aria-hidden="true"
						/>
						<span className="pill-label">
							{showComparison ? "Hide cross-section" : "Compare all Petrs"}
						</span>
						<span
							className={`pill-chevron ${showComparison ? "up" : ""}`}
							aria-hidden="true"
						>
							▾
						</span>
					</button>

					<div
						id="petr-comparison-panel"
						className={`comparison-collapse ${showComparison ? "open" : ""}`}
						aria-hidden={!showComparison}
					>
						<div className="comparison-collapse-inner">
							<PetrComparison
								techPetrs={techPetrs}
								selectedPetr={selectedPetr}
								setSelectedPetr={setSelectedPetr}
								currentAge={currentAge}
							/>
						</div>
					</div>
				</div>
			</footer>

			{modalOpen && (
				<ConfirmModal
					action={pendingAction}
					age={currentAge}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}

			<ScrollRevealSection />
		</div>
	);
}
