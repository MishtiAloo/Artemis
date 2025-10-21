const request = require("supertest");
const express = require("express");
const vaccineBatchRoutes = require("../routes/vaccineBatch.route");

const app = express();
app.use(express.json());
app.use("/vaccine-batches", vaccineBatchRoutes);

describe("VaccineBatch API Endpoints - Critical Path Testing", () => {
  it("GET /vaccine-batches - should return all vaccine batches", async () => {
    const res = await request(app).get("/vaccine-batches");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /vaccine-batches/:id - should return vaccine batch by id", async () => {
    const res = await request(app).get("/vaccine-batches/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("batchid", 1);
  });

  it("GET /vaccine-batches/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/vaccine-batches/999");
    expect(res.statusCode).toEqual(404);
  });
});
