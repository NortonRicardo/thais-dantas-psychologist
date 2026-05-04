import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'www.plantareducacao.com.br',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
