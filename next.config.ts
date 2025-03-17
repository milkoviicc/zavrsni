import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['snetblobstorage.blob.core.windows.net'], // Add the blob storage domain here
  },
};

export default nextConfig;
