/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */

import axios from "axios";
import { Hono } from "hono";
import { load } from "cheerio";
import { getRandomUserAgent } from "@/constant/agents";

const { BASE_URL } = process.env;

interface ChapterData {
  title: string;
  url: string;
}

interface VolumeData {
  saga: string;
  volume: string;
  coverImage: string;
  arc: string;
  chapters: ChapterData[];
}
const homeCached = new Map<string, { timestamp: number; data: VolumeData[] }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 menit
function respondWithPagination(c: any, volumes: VolumeData[], page: number, limit: number) {
  const total = volumes.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedVolumes = volumes.slice(offset, offset + limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return c.json({
    success: true,
    data: paginatedVolumes,
    page,
    limit,
    total,
    totalPages,
    nextPage,
    prevPage,
  });
}

const app = new Hono().get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = (page - 1) * limit;

  const now = Date.now();

  // Gunakan cache jika masih valid
  const cached = homeCached.get("volume_data");
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return respondWithPagination(c, cached.data, page, limit);
  }

  // Fetch dari target karena tidak ada cache atau sudah expired
  const { data } = await axios.get(BASE_URL as string, {
       headers: {
         "User-Agent": getRandomUserAgent(),
         Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
         "Accept-Language": "en-US,en;q=0.5",
         Referer: "https://www.google.com/",
         Connection: "keep-alive",
       },
  });

  const $ = load(data);

  // ... [Proses parsing volume seperti sebelumnya] ...
  // hasil akhir: volumes: VolumeData[]

  const volumes: VolumeData[] = [];
  let currentSaga = "";

  const unwantedTitles = [
    "One Piece Berwarna",
    "ONE PIECE DIGITAL COLORED",
    "Credit to Eichiro Oda©Colored by Shueisha™Translate dr berbagai sumber",
    "MANGA ONGOING",
    "Credit to Eichiro Oda©Colored by FanmadeTranslate Legal dari Mangaplus Rilis setiap hari Senin/Selasa",
  ];

  $("section").each((_, section) => {
    const $section = $(section);
    const sagaTitle = $section.find("h1").first().text().trim();

    if (sagaTitle.includes("SAGA")) {
      currentSaga = sagaTitle;
      return;
    }

    const volumeTitle = $section.find("h1").first().text().trim();
    if (volumeTitle.startsWith("VOLUME")) {
      const coverImage = $section.find("img").first().attr("src") || "";
      const textEditor = $section.find(".elementor-text-editor");
      let arc = "";
      const chapters: ChapterData[] = [];

      textEditor.find("p").each((_, p) => {
        const $p = $(p);
        $p.find("strong").each((_, strong) => {
          const $strong = $(strong);
          const strongText = $strong.text().trim();
          if (!$strong.find("a").length && strongText.includes("ARC")) {
            arc = strongText.replace(/<br\s*\/?>/gi, "").trim();
          }
        });

        $p.find("a").each((_, link) => {
          const $link = $(link);
          const chapterTitle = $link.text().trim();
          const chapterUrl = $link.attr("href") || "";
          if (chapterTitle && chapterUrl && chapterTitle.startsWith("Ch")) {
            chapters.push({
              title: chapterTitle,
              url: chapterUrl,
            });
          }
        });
      });

      if (chapters.length > 0) {
        volumes.push({
          saga: currentSaga,
          volume: volumeTitle,
          coverImage: coverImage,
          arc: arc,
          chapters: chapters,
        });
      }
    }
  });

  // Simpan ke memory cache
  homeCached.set("volume_data", { timestamp: now, data: volumes });

  // Balas response dengan pagination
  return respondWithPagination(c, volumes, page, limit);
});


export default app;
