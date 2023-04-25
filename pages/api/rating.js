import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log({ session });
  if (session && req.method === "POST") {
    const { starsNumber, productId } = req.body;
    console.log(starsNumber, productId);

    // TODO: Come up with a query to update user rated products based on user session, product id and starsNumber.

    // Signed in
    res.json({ result: true, user: session.user.name });
  } else {
    // Not Signed in
    res.redirect("/unauthorized");
  }
  res.end();
};
