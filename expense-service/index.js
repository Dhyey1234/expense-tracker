const express = require("express");
const { Pool } = require("pg");
const authenticate = require("./middleware/auth");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Database connection

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "expense_tracker",
});

// Check database connection

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Create expenses table

async function initDB() {
  await pool.query(`

        CREATE TABLE IF NOT EXISTS expenses(

            id SERIAL PRIMARY KEY,

            user_id INTEGER NOT NULL,

            title VARCHAR(255) NOT NULL,

            amount DECIMAL(10,2) NOT NULL,

            category VARCHAR(100),

            expense_date DATE DEFAULT CURRENT_DATE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );

    `);

  console.log("Expenses table ready");
}

// JWT Authentication Middleware

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization token required",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Invalid authorization format",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

// Health Check

app.get("/", (req, res) => {
  res.json({
    service: "expense-service",

    status: "running",
  });
});

// CREATE EXPENSE

app.post("/expenses", authenticate, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        error: "Title and amount are required",
      });
    }

    const result = await pool.query(
      `

INSERT INTO expenses

(user_id,title,amount,category)

VALUES($1,$2,$3,$4)

RETURNING *

`,

      [req.user.id, title, amount, category || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});
// UPDATE EXPENSE

app.put(
    "/expenses/:id",
    authenticate,
    async (req, res) => {

        try {

            const { id } = req.params;
            const { title, amount, category } = req.body;

            if (!title || !amount) {
                return res.status(400).json({
                    error: "Title and amount are required"
                });
            }

            const result = await pool.query(
                `
                UPDATE expenses
                SET
                    title = $1,
                    amount = $2,
                    category = $3
                WHERE id = $4
                AND user_id = $5
                RETURNING *
                `,
                [
                    title,
                    amount,
                    category || null,
                    id,
                    req.user.id
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Expense not found"
                });
            }

            res.json(result.rows[0]);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Server error"
            });

        }

    }
);
// DELETE EXPENSE

app.delete(
    "/expenses/:id",
    authenticate,
    async (req, res) => {

        try {

            const { id } = req.params;

            const result = await pool.query(
                `
                DELETE FROM expenses
                WHERE id = $1
                AND user_id = $2
                RETURNING *
                `,
                [
                    id,
                    req.user.id
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Expense not found"
                });
            }

            res.json({
                message: "Expense deleted successfully",
                expense: result.rows[0]
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Server error"
            });

        }

    }
);
// GET USER EXPENSES

app.get("/expenses", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `

SELECT *

FROM expenses

WHERE user_id=$1

ORDER BY created_at DESC

`,

      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

const PORT = process.env.PORT || 3002;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Expense service running on port ${PORT}`);
    });
  })

  .catch((error) => {
    console.error("Database initialization failed:", error);

    process.exit(1);
  });
