const request = require("supertest");
const jwt = require("jsonwebtoken");

const { app, pool } = require("../app");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const token = jwt.sign(
  {
    id: 123,
    email: "test@example.com",
  },
  JWT_SECRET,
  {
    expiresIn: "1h",
  }
);

describe("Expense API", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("GET /expenses should reject unauthenticated request", async () => {
    const response = await request(app).get("/expenses");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(
      "Authorization token required"
    );
  });

  test("POST /expenses should reject request without title or amount", async () => {
    const response = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Groceries",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Title and amount are required"
    );
  });

  test("POST /expenses should create an expense", async () => {
    jest.spyOn(pool, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          user_id: 123,
          title: "Groceries",
          amount: "50.00",
          category: "Food",
        },
      ],
    });

    const response = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Groceries",
        amount: 50,
        category: "Food",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Groceries");
    expect(response.body.amount).toBe("50.00");
    expect(response.body.user_id).toBe(123);
  });

  test("GET /expenses should return user expenses", async () => {
    jest.spyOn(pool, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          user_id: 123,
          title: "Groceries",
          amount: "50.00",
          category: "Food",
        },
        {
          id: 2,
          user_id: 123,
          title: "Gas",
          amount: "40.00",
          category: "Transport",
        },
      ],
    });

    const response = await request(app)
      .get("/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("Groceries");
    expect(response.body[1].title).toBe("Gas");
  });

  test("DELETE /expenses/:id should return 404 when expense does not exist", async () => {
    jest.spyOn(pool, "query").mockResolvedValue({
      rows: [],
    });

    const response = await request(app)
      .delete("/expenses/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Expense not found");
  });
});
  test("PUT /expenses/:id should update an expense", async () => {
    jest.spyOn(pool, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          user_id: 123,
          title: "Updated Groceries",
          amount: "75.00",
          category: "Food",
        },
      ],
    });

    const response = await request(app)
      .put("/expenses/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Groceries",
        amount: 75,
        category: "Food",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Groceries");
    expect(response.body.amount).toBe("75.00");
    expect(response.body.category).toBe("Food");
  });

  test("GET /expenses should return 500 when database query fails", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .get("/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Server error");
  });
