import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pg', 'pg-native'],
  images: {
    formats: ['image/avif', 'image/webp'],
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
