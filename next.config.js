/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.nerd3dbr.com'],
  },
  async rewrites() {
    // Use fallback rewrites so local app/api routes take precedence during development.
    // Any /api path that is NOT implemented locally will be proxied to the external API URL.
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
