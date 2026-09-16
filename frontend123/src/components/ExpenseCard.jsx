import { Pencil, Trash2 } from "lucide-react";
import Badge from "./ui/Badge";

function formatAmount(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <div className="expense-row">
      <div className="expense-row-main">
        <span className="expense-row-title">{expense.title}</span>
        <div className="expense-row-meta">
          <Badge>{expense.category}</Badge>
          {expense.date && (
            <span className="expense-row-date">{expense.date}</span>
          )}
        </div>
      </div>

      <span className="expense-row-amount">{formatAmount(expense.amount)}</span>

      <div className="expense-row-actions">
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.title}`}
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(expense)}
          aria-label={`Delete ${expense.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;
