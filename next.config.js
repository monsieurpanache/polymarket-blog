/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx'],
  reactStrictMode: true,
  
  images: {
    unoptimized: true,
  },

  experimental: {
    staticGenerationRetryCount: 3,
  },
};

module.exports = nextConfig;
