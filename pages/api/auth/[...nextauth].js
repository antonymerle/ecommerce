import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

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
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "email",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@gmail.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        console.log({ credentials }, { req: req.body });

        const groqQuery = `*[_type == "user" && email == $userEmail]`;

        const userinDB = await client.fetch(groqQuery, {
          userEmail: req.body.email,
        });

        console.log({ userinDB });

        let user = null;

        if (userinDB?.length) {
          console.log("There already someone with that email in DB");
          user = {
            id: userinDB[0]._id,
            name: `${userinDB[0].given_name} ${userinDB[0].family_name}`,
            email: userinDB[0].email,
          };
        }

        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          console.log("ok branch");
          console.log(user);
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          console.log("no-no branch");
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signin callback");
      if (credentials) {
        console.log("user signed in with credential", { user });
        // HANDLE signin with credentials
        return credentials;
      }
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
