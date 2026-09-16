import ExpenseCard from "./ExpenseCard";
import EmptyState from "./ui/EmptyState";
import Button from "./ui/Button";
import { Plus } from "lucide-react";

function ExpenseList({ expenses, onEdit, onDelete, onAdd }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses yet"
        message="Start tracking your spending by adding your first expense."
        action={
          <Button size="sm" onClick={onAdd}>
            <Plus size={15} />
            Add expense
          </Button>
        }
      />
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ExpenseList;
