import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: "2023-04-13",
  useCdn: true,
});

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const doc = {
        _id: account.providerAccountId,
        _type: "user",
        providerId: account.providerAccountId,
        given_name: profile.given_name,
        family_name: profile.family_name,
        email: profile.email,
        profileImage: profile.picture,
        role: "customer",
        provider: account.provider,
      };

      try {
        await client.createIfNotExists(doc);
        console.log("User document created if was not already present in DB");
        return true; // Return a value to indicate success
      } catch (error) {
        console.error("Error creating document:", error);
        return false; // Return a value to indicate failure
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log({ ...profile, ...provider });
      return token;
    },
  },
  httpOptions: {
    timeout: 40000,
  },
};

export default NextAuth(authOptions);
