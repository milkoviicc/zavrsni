import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snetblobstorage.blob.core.windows.net',
        port: '',
        pathname: '/snetprofiles/**',
      },
      {
        protocol: 'https',
        hostname: 'snetblobstorage.blob.core.windows.net',
        port: '',
        pathname: '/snetposts/**',
      },
    ],
  },
};

export default nextConfig;
