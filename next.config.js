/** @type {import('next').NextConfig} */

// const path = require('path');
const nextConfig = {
  reactStrictMode: false,
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')]
  // }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fb133dae6fb84f21afc46c0547883175.r2.dev',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
