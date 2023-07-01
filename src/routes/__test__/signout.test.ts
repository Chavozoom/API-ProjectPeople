import { app } from "../../../app";
import request from "supertest";

it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "password", name: "Maike" })
    .expect(201);

  await request(app).post("/api/users/signout").send({}).expect(200);
});
