/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ["cdn.sanity.io"] },
  env: {
    NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    NEXT_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    STRIPE_FREE_SHIPPING: process.env.STRIPE_FREE_SHIPPING,
    STRIPE_FAST_SHIPPING: process.env.STRIPE_FAST_SHIPPING,
  },
};

module.exports = nextConfig;
