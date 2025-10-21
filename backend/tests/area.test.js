const request = require("supertest");
const express = require("express");
const areaRoutes = require("../routes/area.route");

const app = express();
app.use(express.json());
app.use("/areas", areaRoutes);

describe("Area API Endpoints - Critical Path Testing", () => {
  it("GET /areas - should return all areas", async () => {
    const res = await request(app).get("/areas");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /areas/:id - should return area by id", async () => {
    const res = await request(app).get("/areas/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("areaid", 1);
  });

  it("GET /areas/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/areas/999");
    expect(res.statusCode).toEqual(404);
  });
});
