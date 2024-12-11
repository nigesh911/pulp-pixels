/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize build performance
  swcMinify: true,
  
  // Reduce build trace complexity
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false
  },

  // Optimize image handling
  images: {
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60,
    formats: ['image/webp']
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      },
    }
    return config
  }
}

module.exports = nextConfig 