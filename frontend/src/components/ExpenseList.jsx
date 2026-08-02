import ExpenseCard from "./ExpenseCard";

function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <>
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
        />
      ))}
    </>
  );
}

export default ExpenseList;