import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI!,
    MONGODB_DB: process.env.MONGODB_DB!
  }
};

export default nextConfig;
