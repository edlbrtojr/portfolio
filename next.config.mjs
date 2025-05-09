/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    localeDetection: true,
  },
}

export default nextConfig
