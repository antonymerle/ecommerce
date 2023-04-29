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
      id: "credentials",
      name: "Credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      // name: "email",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   email: {
      //     label: "Email",
      //     type: "email",
      //     placeholder: "john.doe@gmail.com",
      //   },
      //   password: { label: "Mot de passe", type: "password" },
      // },
      async authorize(credentials, req) {
        // console.log({ credentials }, { req: req.body });

        const { email, password, formType } = req.body;
        console.log(email, password, formType);

        if (
          !email ||
          !password ||
          (formType !== "signin" && formType !== "signup")
        ) {
          console.log("missing parameters");
          return null;
        }

        if (formType == "signin") {
          console.log(
            "signin transmission endpoint",
            process.env.BASE_DOMAIN_URL
          );
          const res = await fetch(
            `${process.env.BASE_DOMAIN_URL}/api/auth/credentials-signin`,
            {
              method: "POST",
              body: JSON.stringify(req.body),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await res.json();

          console.log({ user });

          if (res.ok && user) {
            console.log("res & user : ok", { user });
            return user;
          }
          console.log(user.error);
          return null;
        } else if (formType == "signup") {
          console.log(
            "signup transmission endpoint",
            process.env.BASE_DOMAIN_URL
          );
          const res = await fetch(
            `${process.env.BASE_DOMAIN_URL}/api/auth/credentials-signup`,
            {
              method: "POST",
              body: JSON.stringify(req.body),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await res.json();

          if (res.ok && user) {
            console.log("res & user : ok", user);
            return user;
          }

          return null;
        }
        console.log("bug logic branch");
      },

      // console.log({ userinDB });

      // let user = null;
      // let isNewUser = false;

      // signin
      // user already registered in DB

      // else {
      //   // we register new user in DB
      //   user = {
      //     _type: "user",
      //     email: email,
      //     given_name: email.split("@")[0],
      //     provider: "credentials",
      //     providerId: "credentials",
      //     role: "customer",
      //     isNewUser: true,
      //   };
      //   client.create(user).then((response) => {
      //     console.log(
      //       `New user ${
      //         email.split("@")[0]
      //       } was created with credentials method and _id of ${response._id}`
      //     );
      //   });
      //   isNewUser = true;
      // }

      // Add logic here to look up the user from the credentials supplied
      // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

      // if (user) {
      //   console.log("ok branch");
      //   console.log(user);
      // Any object returned will be saved in `user` property of the JWT
      //   return user;
      // } else {
      //   console.log("no-no branch");
      // If you return null then an error will be displayed advising the user to check their details.
      // return "erreur";
      // res.redirect("/canceled");

      // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      // }
      // },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signin callback");
      if (credentials) {
        console.log("user signed in with credential", { user });
        // HANDLE signin with credentials
        return user;
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
      console.log("redirect callback");
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt callback");
      console.log({ token });
      console.log({ profile });

      console.log({ isNewUser });
      console.log({ user });
      console.log({ account });
      return token;
    },
    async session({ session, user, token }) {
      console.log("session callback");
      console.log({ user });
      console.log({ session });
      console.log({ token });
      const groqQuery = `*[_type == "user" && email == $userEmail]`;

      const userinDB = await client.fetch(groqQuery, {
        userEmail: session.user.email,
      });

      if (userinDB.length) {
        return {
          session: {
            user: { ...userinDB[0] },
          },
        };
      }

      return session;
    },
  },
  httpOptions: {
    timeout: 40000,
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

export default NextAuth(authOptions);
