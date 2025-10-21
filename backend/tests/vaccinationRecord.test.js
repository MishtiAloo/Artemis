const request = require("supertest");
const express = require("express");
const vaccinationRecordRoutes = require("../routes/vaccinationRecord.route");

const app = express();
app.use(express.json());
app.use("/vaccination-records", vaccinationRecordRoutes);

describe("VaccinationRecord API Endpoints - Critical Path Testing", () => {
  it("GET /vaccination-records - should return all vaccination records", async () => {
    const res = await request(app).get("/vaccination-records");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /vaccination-records/:id - should return vaccination record by id", async () => {
    const res = await request(app).get("/vaccination-records/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("recordid", 1);
  });

  it("GET /vaccination-records/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/vaccination-records/999");
    expect(res.statusCode).toEqual(404);
  });
});
