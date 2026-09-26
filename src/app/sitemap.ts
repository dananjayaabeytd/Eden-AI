import type { MetadataRoute } from "next";

import { LEGAL, ROUTES, SITE } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}${ROUTES.privacy}`, lastModified: new Date(LEGAL.lastUpdated), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}${ROUTES.terms}`, lastModified: new Date(LEGAL.lastUpdated), changeFrequency: "yearly", priority: 0.3 },
  ];
}
