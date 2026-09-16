const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/auth");

const app = express();

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

describe("Authentication Middleware", () => {

  test("should reject request without token", async () => {
    const response = await request(app).get("/protected");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(
      "Authorization token required"
    );
  });

  test("should reject invalid token format", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "InvalidToken");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(
      "Invalid token format"
    );
  });

  test("should reject invalid JWT", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(
      "Invalid or expired token"
    );
  });

  test("should allow request with valid JWT", async () => {
    const token = jwt.sign(
      {
        id: 123,
        email: "test@example.com"
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Access granted");
    expect(response.body.user.id).toBe(123);
    expect(response.body.user.email).toBe(
      "test@example.com"
    );
  });

});