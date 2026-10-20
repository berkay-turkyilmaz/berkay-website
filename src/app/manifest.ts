import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.fullName} | Frontend Developer`,
    short_name: siteConfig.fullName,
    description: "Frontend Developer in Istanbul. Projects, code and notes.",
    start_url: "/",
    display: "browser",
    background_color: "#F6F2EA",
    theme_color: "#1B1915",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
