import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TZ: "Asia/Seoul",
  },
  /* config options here */
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3001/api/:path*`
          : "https://api.bamtoly.com/api/:path*",
    },
  ],
  assetPrefix:
    process.env.NODE_ENV !== "development"
      ? "https://static.bamtoly.com"
      : undefined,
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "d3t7exr31xs1l7.cloudfront.net" },
      { hostname: "images.bamtoly.com" },
      { hostname: "static.bamtoly.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
