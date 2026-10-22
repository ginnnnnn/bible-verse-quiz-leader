import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "勇士班經文",
    short_name: "勇士班經文",
    description: "學員版與領袖版經文卡，讓神的話陪伴每一天。",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f7f3",
    theme_color: "#f8f7f3",
    lang: "zh-Hant",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
