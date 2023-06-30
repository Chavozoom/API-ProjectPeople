import { connectDatabase } from "./src/database/db";
import * as dotenv from "dotenv";
dotenv.config();
import { app } from "./app";

const port = process.env.PORT || 4000;
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  await connectDatabase();

  app.listen(port, () => {
    console.log(`Listening on port: ${port}!`);
  });
};

start();
