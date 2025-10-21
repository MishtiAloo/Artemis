const request = require("supertest");
const express = require("express");
const hospitalRoutes = require("../routes/hospital.route");

const app = express();
app.use(express.json());
app.use("/hospitals", hospitalRoutes);

describe("Hospital API Endpoints - Critical Path Testing", () => {
  it("GET /hospitals - should return all hospitals", async () => {
    const res = await request(app).get("/hospitals");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /hospitals/:id - should return hospital by id", async () => {
    const res = await request(app).get("/hospitals/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("hospitalid", 1);
  });

  it("GET /hospitals/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/hospitals/999");
    expect(res.statusCode).toEqual(404);
  });
});
