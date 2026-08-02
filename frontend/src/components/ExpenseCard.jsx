function ExpenseCard({ expense }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px"
      }}
    >
      <h3>{expense.title}</h3>

      <p>
        Amount: ${expense.amount}
      </p>

      <p>
        Category: {expense.category}
      </p>
    </div>
  );
}

export default ExpenseCard;