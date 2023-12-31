import { app } from "../../../app";
import request from "supertest";

it("returns a 200 on sucessful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@example.com", password: "password" })
    .expect(200);
});

it("returns cookies", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@example.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 on not find email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@example.com", password: "password" })
    .expect(400);
});

it("returns a 400 on not match password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@example.com", password: "pass" })
    .expect(400);
});
