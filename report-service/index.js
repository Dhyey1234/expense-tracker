const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());

const EXPENSE_SERVICE =
  process.env.EXPENSE_SERVICE || "http://expense-service:3002";

app.get("/", (req, res) => {
  res.json({
    service: "report-service",

    status: "running",
  });
});

app.get("/reports/summary", async (req, res) => {
  try {
    const response = await axios.get(
      `${EXPENSE_SERVICE}/expenses`,

      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    const expenses = response.data;

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),

      0,
    );

    res.json({
      totalExpenses,

      expenseCount: expenses.length,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Unable to generate report",
    });
  }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Report service running on port ${PORT}`);
});
