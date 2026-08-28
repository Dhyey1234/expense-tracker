const request = require("supertest");

const express = require("express");

const app = express();

app.get("/health", (req, res) => {

    res.json({
        status: "ok",
        service: "auth-service"
    });

});


describe("Auth Service", () => {

    test("GET /health should return 200", async () => {

        const response =
            await request(app).get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.status).toBe("ok");

        expect(response.body.service)
            .toBe("auth-service");

    });

});