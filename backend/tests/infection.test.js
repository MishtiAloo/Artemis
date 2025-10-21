const request = require("supertest");
const express = require("express");
const infectionRoutes = require("../routes/infection.route");

const app = express();
app.use(express.json());
app.use("/infections", infectionRoutes);

describe("Infection API Endpoints - Critical Path Testing", () => {
  it("GET /infections - should return all infections", async () => {
    const res = await request(app).get("/infections");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /infections/:id - should return infection by id", async () => {
    const res = await request(app).get("/infections/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("infectionid", 1);
  });

  it("GET /infections/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/infections/999");
    expect(res.statusCode).toEqual(404);
  });
});
