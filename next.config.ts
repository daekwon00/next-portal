import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  fallbacks: {
    document: '/offline.html',
  },
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
})

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8081/api/v1/:path*',
      },
    ]
  },
}

export default withPWA(nextConfig)
