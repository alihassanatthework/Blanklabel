import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: NOINDEX ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/", disallow: ["/checkout", "/account", "/cart"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
