import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/manager/hardware',
        destination: '/manager/infraestrutura/hardware',
        permanent: true,
      },
      {
        source: '/manager/plataformas',
        destination: '/manager/infraestrutura/plataformas',
        permanent: true,
      },
      {
        source: '/manager/rede-colaboracao',
        destination: '/manager/infraestrutura/parcerias',
        permanent: true,
      },
    ]
  },
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
