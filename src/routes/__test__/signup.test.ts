import { app } from "../../../app";
import request from "supertest";

it("returns a 201 on sucessful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);
});

it("returns a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "@example.com", password: "password", name: "Maike" })
    .expect(400);
});

it("returns a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "abc@example.com", password: "pas", name: "Maike" })
    .expect(400);
});

it("returns a 400 on null name", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "abc@example.com", password: "pas" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "abc@example.com", password: "pas", name: "" })
    .expect(400);
});

it("returns a 400 on empty email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(400);
});

it("set a cookie after sucess signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
