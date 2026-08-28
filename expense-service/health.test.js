const request = require("supertest");

const express = require("express");

const app = express();


app.get("/", (req, res) => {

    res.json({

        service: "expense-service",

        status: "running"

    });

});


describe("Expense Service", () => {

    test("GET / should return 200", async () => {

        const response =
            await request(app).get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body.service)
            .toBe("expense-service");

        expect(response.body.status)
            .toBe("running");

    });

});