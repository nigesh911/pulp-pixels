/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true
  },

  // Reduce build trace complexity
  experimental: {
    optimizeCss: true
  },

  // Optimize image handling
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bihzhhyljtftmvspnqeg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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