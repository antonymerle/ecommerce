// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./auth/[...nextauth]";

// export default async (req, res) => {
//   const session = await getServerSession(req, res, authOptions);
//   console.log({ session });
//   if (session) {
//     // Signed in
//     console.log("Session", JSON.stringify(session, null, 2));
//   } else {
//     // Not Signed in
//     res.status(401);
//   }
//   res.end();
// };

// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
  // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({ req });
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
