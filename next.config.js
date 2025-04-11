/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  // We'll handle redirects in a more compatible way
  // that doesn't require importing fs modules at the top level
};

module.exports = nextConfig;
