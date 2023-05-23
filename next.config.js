// Demo mode, env variables are all pointing to test mode

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mui/icons-material",
    "@mui/material",
    "@mui/x-data-grid",
  ],
  reactStrictMode: true,
  images: { domains: ["cdn.sanity.io"] },
  env: {
    NEXT_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_FREE_SHIPPING: process.env.STRIPE_FREE_SHIPPING,
    STRIPE_FAST_SHIPPING: process.env.STRIPE_FAST_SHIPPING,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_TITLE: process.env.SANITY_TITLE,
    SANITY_DATASET: process.env.SANITY_DATASET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BASE_DOMAIN_URL:
      process.env.NODE_ENV === "production"
        ? "https://jolishop.vercel.app"
        : "http://localhost:3000",
    CONTACT_ORDERS: process.env.CONTACT_ORDERS,
  },
};

module.exports = nextConfig;

// Replace env field by this code to activate live payments w/ stripe

//   env: {
//     NEXT_STRIPE_PUBLISHABLE_KEY:
//       process.env.NODE_ENV === "production"
//         ? process.env.PROD_NEXT_STRIPE_PUBLISHABLE_KEY
//         : process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
//     STRIPE_SECRET_KEY:
//       process.env.NODE_ENV === "production"
//         ? process.env.PROD_STRIPE_SECRET_KEY
//         : process.env.STRIPE_SECRET_KEY,
//     STRIPE_FREE_SHIPPING:
//       process.env.NODE_ENV === "production"
//         ? process.env.PROD_STRIPE_FREE_SHIPPING
//         : process.env.STRIPE_FREE_SHIPPING,
//     STRIPE_FAST_SHIPPING:
//       process.env.NODE_ENV === "production"
//         ? process.env.PROD_STRIPE_FAST_SHIPPING
//         : process.env.STRIPE_FAST_SHIPPING,
//     STRIPE_WEBHOOK_SECRET:
//       process.env.NODE_ENV === "production"
//         ? process.env.PROD_STRIPE_WEBHOOK_SECRET
//         : process.env.STRIPE_WEBHOOK_SECRET,
//     NEXT_PUBLIC_SANITY_TOKEN: process.env.NEXT_PUBLIC_SANITY_TOKEN,
//     SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
//     SANITY_TITLE: process.env.SANITY_TITLE,
//     SANITY_DATASET: process.env.SANITY_DATASET,
//     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
//     GOOGLE_ID: process.env.GOOGLE_ID,
//     GOOGLE_SECRET: process.env.GOOGLE_SECRET,
//     FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
//     FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
//     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
//     BASE_DOMAIN_URL:
//       process.env.NODE_ENV === "production"
//         ? "https://jolishop.vercel.app"
//         : "http://localhost:3000",
//     CONTACT_ORDERS: process.env.CONTACT_ORDERS,
//   },

// module.exports = nextConfig;
