import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: "mongodb+srv://keshav:keshav@kalster69.42ysvju.mongodb.net/?retryWrites=true&w=majority&appName=kalster69"!,
    MONGODB_DB: "buzzKGP"!
  }
};

export default nextConfig;
