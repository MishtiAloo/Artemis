const request = require("supertest");
const express = require("express");
const patientRoutes = require("../routes/patient.route");

const app = express();
app.use(express.json());
app.use("/patients", patientRoutes);

describe("Patient API Endpoints - Critical Path Testing", () => {
  it("GET /patients - should return all patients", async () => {
    const res = await request(app).get("/patients");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /patients/:id - should return patient by id", async () => {
    const res = await request(app).get("/patients/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("patientid", 1);
  });

  it("GET /patients/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/patients/999");
    expect(res.statusCode).toEqual(404);
  });
});
