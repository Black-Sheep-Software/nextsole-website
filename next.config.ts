import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Blog cover/content images are uploaded to Cloudinary via the main
    // app's admin (see nextsole/app/api/admin/blog/upload-image).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
