/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Игнорировать ошибки типов при сборке на Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорировать ошибки линтера при сборке
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
