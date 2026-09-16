import { useState } from "react";
import Field from "./ui/Field";
import Button from "./ui/Button";

const CATEGORY_SUGGESTIONS = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

function ExpenseForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [amount, setAmount] = useState(initialValues?.amount ?? "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialValues);

  function validate() {
    const next = {};
    if (!title.trim()) next.title = "Enter a title";
    if (amount === "" || Number(amount) <= 0)
      next.amount = "Enter an amount greater than 0";
    if (!category.trim()) next.category = "Enter a category";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), amount, category: category.trim() });
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <Field label="Title" id="expense-title" error={errors.title}>
        <input
          id="expense-title"
          placeholder="e.g. Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "has-error" : ""}
        />
      </Field>

      <Field label="Amount" id="expense-amount" error={errors.amount}>
        <input
          id="expense-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={errors.amount ? "has-error" : ""}
        />
      </Field>

      <Field label="Category" id="expense-category" error={errors.category}>
        <input
          id="expense-category"
          list="expense-category-suggestions"
          placeholder="e.g. Food"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={errors.category ? "has-error" : ""}
        />
        <datalist id="expense-category-suggestions">
          {CATEGORY_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>

      <div className="expense-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : isEdit
            ? "Save changes"
            : "Add expense"}
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
