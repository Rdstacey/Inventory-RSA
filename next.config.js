/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // Base path for GitHub Pages (will be set when deploying)
  // basePath: '/inventory-website',
}

module.exports = nextConfig

