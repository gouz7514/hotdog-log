import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [20, 40, 60, 80, 100],
  },
  // /posts → /blog 로 주소 변경. 기존 링크·검색 결과를 위해 영구 리다이렉트
  async redirects() {
    return [
      {
        source: '/posts/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/en/posts/:path*',
        destination: '/en/blog/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
