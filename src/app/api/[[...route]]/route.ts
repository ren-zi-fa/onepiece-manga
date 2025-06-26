import { Hono } from "hono";
import { handle } from "hono/vercel";
import home from "./home";
import read from "./read";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/", async (c) => {
  return c.json({
    message: "this work",
  });
});

export const routes = app.route("/home", home).route("/read", read);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
