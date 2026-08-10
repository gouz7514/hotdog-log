/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    qualities: [20, 40, 60, 80, 100],
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig
