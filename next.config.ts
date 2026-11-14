import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ... other experimental flags if any
    agentUpgrade: "security",
  }};

export default nextConfig;
