import "./Confirmmodal.css";

export default function ConfirmModal({ action, age, onConfirm, onCancel }) {
  const isIntroduce = action?.type === "introduce";

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="modal-warning">
          {isIntroduce
            ? `Introducing tech at age ${age} has a side effect.`
            : `Removing tech at age ${age} has a side effect.`}
        </p>
        <p className="modal-question">Are you sure?</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-btn modal-btn--no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}