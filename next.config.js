/** @type {import('next').NextConfig} */

// const path = require('path');
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/images/:path*',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
  //       ]
  //     }
  //   ];
  // },
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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig);
