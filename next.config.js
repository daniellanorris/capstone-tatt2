/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
      AWS_SECRET: process.env.AWS_SECRET,
      AWS_ACCESS: process.env.AWS_ACCESS
    },
  }
  
  module.exports = nextConfig
  