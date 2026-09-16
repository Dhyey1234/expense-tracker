import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Wallet, Calendar, Tag, Receipt, Plus } from "lucide-react";
import { expenseApi } from "../api/axios";
import { getUser, getToken, isAuthenticated, logout } from "../utils/auth";
import Navbar from "../components/Navbar";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function Dashboard() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const user = getUser();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadExpenses() {
    try {
      setLoading(true);
      const response = await expenseApi.get("/expenses", {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      setExpenses(response.data);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Couldn't load your expenses. Try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  function openAddModal() {
    setEditingExpense(null);
    setModalOpen(true);
  }

  function openEditModal(expense) {
    setEditingExpense(expense);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingExpense(null);
  }

  async function handleFormSubmit({ title, amount, category }) {
    setSubmitting(true);

    try {
      if (editingExpense) {
        await expenseApi.put(
          `/expenses/${editingExpense.id}`,
          { title, amount, category },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );
      } else {
        await expenseApi.post(
          "/expenses",
          { title, amount, category },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );
      }

      closeModal();
      loadExpenses();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(expense) {
    const confirmed = window.confirm(`Delete "${expense.title}"?`);
    if (!confirmed) return;

    try {
      await expenseApi.delete(`/expenses/${expense.id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      loadExpenses();
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  const stats = useMemo(() => {
    const total = expenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );

    const now = new Date();
    const thisMonth = expenses.reduce((sum, e) => {
      if (!e.date) return sum;
      const d = new Date(e.date);
      const sameMonth =
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
      return sameMonth ? sum + (Number(e.amount) || 0) : sum;
    }, 0);

    const categories = new Set(expenses.map((e) => e.category)).size;

    return { total, thisMonth, categories, count: expenses.length };
  }, [expenses]);

  const formatCurrency = (value) =>
    value.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <div className="dashboard-page">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
            <p>Here's a snapshot of your spending.</p>
          </div>
          <Button onClick={openAddModal}>
            <Plus size={16} />
            Add expense
          </Button>
        </div>

        <div className="stat-grid">
          <StatCard
            hero
            label="Total expenses"
            value={formatCurrency(stats.total)}
            icon={Wallet}
          />
          <StatCard
            label="This month"
            value={formatCurrency(stats.thisMonth)}
            icon={Calendar}
          />
          <StatCard
            label="Categories"
            value={stats.categories}
            icon={Tag}
          />
          <StatCard
            label="Expenses"
            value={stats.count}
            icon={Receipt}
          />
        </div>

        <section className="expense-section">
          <div className="expense-section-header">
            <h2>Recent expenses</h2>
          </div>

          {error && <div className="banner banner-error">{error}</div>}

          {loading ? (
            <LoadingSpinner label="Loading expenses" />
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAdd={openAddModal}
            />
          )}
        </section>
      </main>

      {modalOpen && (
        <Modal
          title={editingExpense ? "Edit expense" : "Add expense"}
          onClose={closeModal}
        >
          <ExpenseForm
            initialValues={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
