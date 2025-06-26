/* eslint-disable  @typescript-eslint/no-explicit-any */


import axios from "axios";
import { Hono } from "hono";
import { load } from "cheerio";
import { getRandomUserAgent } from "@/constant/agents";

const { BASE_URL } = process.env;
const slugCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 menit

const app = new Hono().get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const now = Date.now();
  const cached = slugCache.get(slug);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return c.json({
      success: true,
      data: cached.data,
      cached: true, // optional info for debugging
    });
  }

  // Fetch fresh data if not cached or expired
  const { data } = await axios.get(`${BASE_URL}/${slug}`, {
    headers: {
      "User-Agent": getRandomUserAgent(),
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Referer: "https://www.google.com/",
      Connection: "keep-alive",
    },
  });

  const $ = load(data);

  const images: {
    type: "comic" | "ads";
    imageUrl: string;
    alt?: string;
    linkUrl?: string;
  }[] = [];

  $(".entry-content img").each((_, el) => {
    const imageUrl = $(el).attr("src");
    const alt = $(el).attr("alt") || "";
    const parentLink = $(el).closest("a").attr("href");

    images.push({
      type: imageUrl?.includes("/komik/") ? "comic" : "ads",
      imageUrl: imageUrl || "",
      alt,
      linkUrl: parentLink,
    });
  });

  // Simpan ke cache
  slugCache.set(slug, { timestamp: now, data: images });

  return c.json({
    success: true,
    data: images,
  });
});

export default app;
