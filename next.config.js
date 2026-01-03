/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // Base path for GitHub Pages - matches repository name
  basePath: '/Inventory-RSA',
}

module.exports = nextConfig

