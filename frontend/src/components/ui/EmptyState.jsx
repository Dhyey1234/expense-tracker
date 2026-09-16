import { Receipt } from "lucide-react";

function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Receipt size={22} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
