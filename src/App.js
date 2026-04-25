import { useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard/Profilecard.js";
import SocialGraph from "./components/SocialGraph/Socialgraph.js";
import AgeTimeline from "./components/AgeTimeline/Agetimeline.js";
import ConfirmModal from "./components/ConfirmModal/Confirmmodal.js";
import Supabase, { addPerson } from "./supabaseClient.js";
//import supabase from "./supabaseClient";
import "./App.css";

const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const NAMES = ["Petr 1", "Petr 2", "Petr 3", "Petr 4", "Petr 5"]
const TABLES = ["person_A", "person_B", "person_C", "person_D", "person_E"]

const EVENTS_BY_AGE = {
  6:  "Started elementary school. Made first best friend on the playground.",
  12: "Got first smartphone. Joined a school sports team.",
  18: "Graduated high school. Learned to drive.",
  24: "Landed first full-time job. Moved into own apartment.",
};

export default function App() {
  const [currentAge, setCurrentAge] = useState(6);
  const [techPetrs, setTechPetrs] = useState(new Set());
  const [pendingAction, setPendingAction] = useState(null); // { type: 'introduce' | 'remove', age }
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPetr, setSelectedPetr] = useState("Petr 1");

  const currentIndex = AGES.indexOf(currentAge);

  useEffect(() => {
    for (let i = 0; i < TABLES.length; i++) {
      addPerson(NAMES[i], TABLES[i]);
    }
  }, []);

  const handleAgeDown = () => {
    if (currentIndex > 0) setCurrentAge(AGES[currentIndex - 1]);
  };

  const handleAgeUp = () => {
    if (currentIndex < AGES.length - 1) setCurrentAge(AGES[currentIndex + 1]);
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
      setTechPetrs(prev => new Set([...prev, selectedPetr]));
    }
    if (pendingAction?.type === "remove") {
      setTechPetrs(prev => {
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
        <span className="app-title">LifeGraph</span>
        <span className="app-subtitle">Social Development Simulator</span>
      </header>

      <main className="app-layout">
        <aside className="left-panel">
          <ProfileCard
            age={currentAge}
            techIntroduced={techPetrs.has(selectedPetr)}
            onIntroduce={handleIntroduce}
            onRemove={handleRemove}
            selectedPetr={selectedPetr}
          />
        </aside>

        <section className="center-panel">
          <SocialGraph
            age={currentAge}
            techIntroduced={techPetrs.has(selectedPetr)}
            techPetrs={techPetrs}
            selectedPetr={selectedPetr}
            setSelectedPetr={setSelectedPetr}
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
        <div className="event-box">
          <span className="event-label">event that happened after age up</span>
          <p className="event-text">{EVENTS_BY_AGE[currentAge]}</p>
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
    </div>
  );
}