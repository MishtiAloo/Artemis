const request = require("supertest");
const express = require("express");
const vaccineRoutes = require("../routes/vaccine.route");

const app = express();
app.use(express.json());
app.use("/vaccines", vaccineRoutes);

describe("Vaccine API Endpoints - Critical Path Testing", () => {
  it("GET /vaccines - should return all vaccines", async () => {
    const res = await request(app).get("/vaccines");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /vaccines/:id - should return vaccine by id", async () => {
    const res = await request(app).get("/vaccines/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("vaccineid", 1);
  });

  it("GET /vaccines/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/vaccines/999");
    expect(res.statusCode).toEqual(404);
  });
});
