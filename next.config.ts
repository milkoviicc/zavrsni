import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['snetblobstorage.blob.core.windows.net'], // Add the blob storage domain here
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    }
  }
};

export default nextConfig;
