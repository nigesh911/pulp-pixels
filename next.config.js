/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bihzhhyljtftmvspnqeg.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bihzhhyljtftmvspnqeg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig 