import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Legacy WordPress / WooCommerce URLs (future migration)
    return [{ source: "/shop/category/:path*", destination: "/shop/:path*", permanent: true }];
  },
  async headers() {
    // Demo deployment is a preview: keep it out of search indexes (DEMO_NOINDEX=false to disable).
    if (process.env.DEMO_NOINDEX === "false") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
