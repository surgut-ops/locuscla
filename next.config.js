/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@qdrant/js-client-rest'],
  },
};

module.exports = nextConfig;
