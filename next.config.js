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
  // typescript: {
  //   // 타입 오류가 있어도 빌드 진행
  //   ignoreBuildErrors: true
  // },
  // eslint: {
  //   // ESLint 오류 무시
  //   ignoreDuringBuilds: true
  // },
  reactStrictMode: false,
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')]
  // }
  // aws 사용
  images: {
    loader: 'custom',
    loaderFile: './src/app/product/[id]/_lib/llTest.js'
    // minimumCacheTTL: 60
  }
  // cloudflare 사용시
  // images: {
  //   loader: 'custom',
  //   loaderFile: './src/app/product/[id]/_lib/llTest.js', // 전역 로더로 설정할 경우
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'pub-fb133dae6fb84f21afc46c0547883175.r2.dev' // 원본 이미지 저장소
  //     }
  //   ]
  // }
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'pub-fb133dae6fb84f21afc46c0547883175.r2.dev',
  //       port: '',
  //       pathname: '/**'
  //     }
  //   ]
  // }
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig);
