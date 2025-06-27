/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Hono } from "hono";
import { handle } from "hono/vercel";
import home from "./home";
import read from "./read";
import axios from "axios";
const { BASE_URL } = process.env;
const app = new Hono().basePath("/api");

app.get("/", async (c) => {
  return c.json({
    message: "this work",
  });
});

app.get("/check-ip", async (c) => {
  const targetUrl =
    c.req.query("target") || BASE_URL || "https://onepieceberwarna.com/";

  try {
    const response = await axios.get(targetUrl);
    return c.json({
      status: "OK",
      statusCode: response.status,
      data: "yahahhaha work",
      message: "IP Vercel tidak diblokir oleh target",
    });
  } catch (error: any) {
    return c.json(
      {
        status: "Blocked or Error",
        statusCode: error?.response?.status || 500,
        error: error?.message || "Unknown error",
        details: error?.response?.data || null,
      },
      error?.response?.status || 500
    );
  }
});

export const routes = app.route("/home", home).route("/read", read);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
