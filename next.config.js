/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    rpcURL:
      process.env.rpcURL,
  },
};

module.exports = nextConfig;
