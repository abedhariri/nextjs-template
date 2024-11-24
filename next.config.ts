import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
