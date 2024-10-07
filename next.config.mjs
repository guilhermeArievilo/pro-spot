/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: process.env.NEXT_PUBLIC_STRAPI_API_URL,
      //   port: '',
      //   pathname: '/cms/uploads/**/*'
      // },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_STRAPI_API_HOSTNAME || 'localhost',
        port: process.env.NEXT_PUBLIC_STRAPI_API_PORT || '',
        pathname: '/uploads/**/*'
      }
    ]
  }
};

export default nextConfig;
