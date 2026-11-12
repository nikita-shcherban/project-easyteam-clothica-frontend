import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://project-easyteam-2.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
