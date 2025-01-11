// next.config.js
module.exports = {
  reactStrictMode: true, // Enables React Strict Mode for better error detection
  webpack: (config, { isServer }) => {
    // Custom Webpack configurations, if necessary
    if (!isServer) {
      // If it's client-side, use some optimizations or configurations
    }
    return config;
  },
  images: {
    domains: ['example.com'], // Allow external image domains
  },
  env: {
    // Define environment variables here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  },
  redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
}
