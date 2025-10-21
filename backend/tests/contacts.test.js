const request = require("supertest");
const express = require("express");
const contactsRoutes = require("../routes/contacts.route");

const app = express();
app.use(express.json());
app.use("/contacts", contactsRoutes);

describe("Contacts API Endpoints - Critical Path Testing", () => {
  it("GET /contacts - should return all contacts", async () => {
    const res = await request(app).get("/contacts");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /contacts/:id - should return contact by id", async () => {
    const res = await request(app).get("/contacts/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("contactid", 1);
  });

  it("GET /contacts/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/contacts/999");
    expect(res.statusCode).toEqual(404);
  });
});
