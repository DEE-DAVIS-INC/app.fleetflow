import {onRequest} from "firebase-functions/v2/https";
import next from "next";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  dir: path.join(__dirname, "../../"), // Point to the root directory where Next.js app is located
  conf: {
    distDir: ".next"
  }
});

const handle = app.getRequestHandler();

export const nextApp = onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});