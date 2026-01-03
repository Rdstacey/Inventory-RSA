/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // No basePath for custom domain (inventory.rsautomation.net)
  // basePath will be detected dynamically in components for GitHub Pages fallback
  // basePath: '',
}

module.exports = nextConfig

