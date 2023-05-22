import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { client } from "./auth/[...nextauth]";

export default async (req, res) => {
  const rawSession = await getServerSession(req, res, authOptions);
  // handling the non-serializable object throwed by getServerSideProps (sigh)
  const userSession = JSON.parse(JSON.stringify(rawSession));
  console.log("getServerSession");
  console.log({ userSession });
  if (userSession && req.method === "GET") {
    const userId = userSession?.session?.user?.id ?? "";

    console.log({ userId });

    if (!userId) return res.status(403).json({ error: "User not found" });

    /* Important : USE getDocument to retrieve user data in real time OR BUGS due to caching will occur.
      https://www.sanity.io/docs/js-client#fetch-a-single-document
      This will fetch a document from the Doc endpoint.
      This endpoint cuts through any caching/indexing middleware that may involve
      delayed processing.
      */

    // Get Document ID
    // const userDocument = await client.fetch(userQuery, {
    //   email: emailFromSession,
    // });

    // console.log({ userDocument });

    // const userId = userDocument._id;

    // const ordersQuery = "*[_type == 'order'  && customer._ref == $userId]";
    const ordersQuery = `*[_type == 'order' && !(_id in path("drafts.**")) && customer._ref == $userId]`;

    const ordersArray = await client.fetch(ordersQuery, { userId });

    console.log({ ordersArray });

    res.json({ result: true, ordersArray });
  } else {
    res
      .status(401)
      .json({
        result: false,
        message: "Connectez-vous pour accéder à vos commandes",
      })
      .end();
  }
  res.end();
};
