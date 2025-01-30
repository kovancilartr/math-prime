import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "img.clerk.com",
      "picsum.photos",
      "loremflickr.com",
      "utfs.io",
      "unsplash.com",
      "6gvaqvk2ww.ufs.sh",
    ], // Dış alan adını buraya ekleyin
  },
};

export default nextConfig;
