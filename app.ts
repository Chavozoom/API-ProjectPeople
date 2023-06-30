import { NotFoundError, errorHandler } from "@isctickets/common";
import { projectRoute } from "./src/routes/project-route";
import { authRoute } from "./src/routes/user-route";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import express from "express";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use("/api/users", authRoute);
app.use("/api/projects", projectRoute);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
