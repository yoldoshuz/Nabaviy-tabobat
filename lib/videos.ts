import type { VideoItem } from "@/types";

/**
 * The shop's own clips, served from `public/videos/`.
 *
 * Everything here is hosted by this site rather than embedded from YouTube:
 * these are the files the shop supplied, and unlike the sister storefronts
 * Nabaviy Tabobat has no channel to point at. They arrived with names like
 * `SaveVid_Net_AQPC3D9O6fDER_ABFh7AjJjl4jq0ppeuy2j8nOtHHZRSXyxfUTdG.mp4` —
 * two of them with emoji in the file name — so they were renamed, and every
 * one was remuxed with `faststart` so a browser can start playing before the
 * whole file has arrived.
 *
 * They were *not* re-encoded. The sources are 720×1280 H.264 at 0.8–2.1 Mbps
 * and already sit at the practical floor for that size: both an x264 CRF 24
 * pass and a VP9 CRF 33 pass came out **larger** than the originals, so any
 * further shrinking would have meant visibly degrading them.
 *
 * The clips are testimonials — people talking about the range with a box in
 * hand — so they carry no per-clip titles. The two that arrived with a subject
 * in their file name lead the shelf; the rest keep the order they were sent in.
 * Posters are a frame two seconds in, which skips the fade from black.
 */
const SLUGS = [
  "qora-sedana-ayollar-salomatligi",
  "kimyodan-charchadingizmi",
  "nabaviy-tabobat-01",
  "nabaviy-tabobat-02",
  "nabaviy-tabobat-03",
  "nabaviy-tabobat-04",
  "nabaviy-tabobat-05",
  "nabaviy-tabobat-06",
  "nabaviy-tabobat-07",
  "nabaviy-tabobat-08",
  "nabaviy-tabobat-09",
  "nabaviy-tabobat-10",
  "nabaviy-tabobat-11",
  "nabaviy-tabobat-12",
] as const;

export const videos: VideoItem[] = SLUGS.map((slug) => ({
  id: slug,
  poster: `/videos/${slug}.jpg`,
  url: `/videos/${slug}.mp4`,
}));
