/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "nhimsallyfilmsite.s3.ap-southeast-1.amazonaws.com",
      "d3cptuexqel1lc.cloudfront.net",
    ],
  },
};

module.exports = nextConfig;
