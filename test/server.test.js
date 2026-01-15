const tap = require("tap");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const server = supertest(app);
require("dotenv").config();

const mockUser = {
  name: "Ahsas Sharma",
  email: `test-${Date.now()}@example.com`,
  password: "ahsas123",
};

let token = "";

// Setup database connection before tests
tap.before(async () => {
  const DB_NAME = process.env.DB_NAME || "news-aggregator-test";
  const DB_CONNECTION =
    process.env.DB_CONNECTION || "mongodb://localhost:27017/";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(DB_CONNECTION + DB_NAME);
  }
});

// Cleanup after all tests
tap.teardown(async () => {
  await mongoose.connection.close();
});

// Auth tests
tap.test("POST api/v1/auth/register", async (t) => {
  const response = await server.post("/api/v1/auth/register").send(mockUser);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST api/v1/auth/register with missing email", async (t) => {
  const response = await server.post("/api/v1/auth/register").send({
    name: mockUser.name,
    password: mockUser.password,
  });
  t.equal(response.status, 400);
  t.end();
});

tap.test("POST api/v1/auth/login", async (t) => {
  const response = await server.post("/api/v1/auth/login").send({
    email: mockUser.email,
    password: mockUser.password,
  });
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "token");
  token = response.body.token;
  t.end();
});

tap.test("POST api/v1/auth/login with wrong password", async (t) => {
  const response = await server.post("/api/v1/auth/login").send({
    email: mockUser.email,
    password: "wrongpassword",
  });
  t.equal(response.status, 401);
  t.end();
});

// Preferences tests

tap.test("GET /api/v1/preferences", async (t) => {
  const response = await server
    .get("/api/v1/preferences")
    .set("Authorization", `Bearer ${token}`);
  t.equal(response.status, 200);
  t.type(response.body, "object");
  t.hasOwnProp(response.body, "language");
  t.end();
});

tap.test("GET /api/v1/preferences without token", async (t) => {
  const response = await server.get("/api/v1/preferences");
  t.equal(response.status, 401);
  t.end();
});

const updatedPreferences = {
  language: ["eng", "hin"],
  ignoreKeyword: ["C++", "Objective-C"],
  maxDaysBack: 3,
  articlesCount: 5,
  articlesSortBy: "date",
  articlesSortByAsc: true,
  minSentiment: -0.5,
  maxSentiment: 0.8,
};

tap.test("PATCH /api/v1/preferences", async (t) => {
  const response = await server
    .patch("/api/v1/preferences")
    .set("Authorization", `Bearer ${token}`)
    .send(updatedPreferences);
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "preferences");
  t.same(response.body.preferences.language, updatedPreferences.language);
  t.same(
    response.body.preferences.ignoreKeyword,
    updatedPreferences.ignoreKeyword
  );
  t.equal(
    response.body.preferences.maxDaysBack,
    updatedPreferences.maxDaysBack
  );
  t.end();
});

tap.test("Check PATCH /api/v1/preferences", async (t) => {
  const response = await server
    .get("/api/v1/preferences")
    .set("Authorization", `Bearer ${token}`);
  t.equal(response.status, 200);
  t.same(response.body.language, updatedPreferences.language);
  t.same(response.body.ignoreKeyword, updatedPreferences.ignoreKeyword);
  t.equal(response.body.maxDaysBack, updatedPreferences.maxDaysBack);
  t.end();
});

// News tests

tap.test("GET /api/v1/news", async (t) => {
  const response = await server
    .get("/api/v1/news")
    .set("Authorization", `Bearer ${token}`);
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "news");
  t.end();
});

tap.test("GET /api/v1/news without token", async (t) => {
  const response = await server.get("/api/v1/news");
  t.equal(response.status, 401);
  t.end();
});
