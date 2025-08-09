import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RandomFast",
    short_name: "RandomFast",
    description: "Track intermittent and multi-day fasting with weighted random durations.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0ea5a1",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  }
}
