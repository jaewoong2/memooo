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
          : "http://backend/api/:path*",
    },
  ],
  assetPrefix:
    process.env.NODE_ENV !== "development"
      ? undefined
      : // ? "https://static-habbits.bamtoly.com"
        undefined,
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
