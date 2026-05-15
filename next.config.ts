import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://www.plantareducacao.com.br",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
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
