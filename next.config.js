/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ["cdn.sanity.io"] },
  env: {
    NEXT_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_FREE_SHIPPING: process.env.STRIPE_FREE_SHIPPING,
    STRIPE_FAST_SHIPPING: process.env.STRIPE_FAST_SHIPPING,
    NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_TITLE: process.env.SANITY_TITLE,
    SANITY_DATASET: process.env.SANITY_DATASET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  },
};

module.exports = nextConfig;
