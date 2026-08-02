import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { expenseApi } from "../api/axios";
import { getUser, getToken, isAuthenticated, logout } from "../utils/auth";

function Dashboard() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const user = getUser();

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  async function loadExpenses() {
    try {
      const response = await expenseApi.get("/expenses", {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function addExpense(e) {
    e.preventDefault();

    try {
      await expenseApi.post(
        "/expenses",
        {
          title,
          amount,
          category
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      setTitle("");
      setAmount("");
      setCategory("");

      loadExpenses();

    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <div style={{ padding: "30px" }}>

      <h1>Expense Tracker</h1>

      <h3>Welcome {user.email}</h3>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Add Expense</h2>

      <form onSubmit={addExpense}>

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Add Expense
        </button>

      </form>

      <hr />

      <h2>Your Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <h3>{expense.title}</h3>

            <p>Amount: ${expense.amount}</p>

            <p>Category: {expense.category}</p>
          </div>
        ))
      )}

    </div>
  );
}

export default Dashboard;