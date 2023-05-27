import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { client } from "./auth/[...nextauth]";
import bcrypt from "bcrypt";

export default async (req, res) => {
  const rawSession = await getServerSession(req, res, authOptions);
  // handling the non-serializable object throwed by getServerSideProps (sigh)
  const userSession = JSON.parse(JSON.stringify(rawSession));
  const { firstName, lastName, email, password, provider } = req.body;

  if (!firstName || !lastName || !email || !provider) {
    res.status(400).send("Missing parameters").end();
  } else if (!userSession) {
    res.status(403).send("Not authorized").end();
  } else if (req.method !== "PUT") {
    res.status(405).send("Method Not Allowed").end();
  }

  const groqQuery = `*[_type == "user" && _id == $idFromSession][0]`;
  const idFromSession = userSession?.session?.user?.id ?? "";

  if (!idFromSession) return res.status(403).json({ error: "User not found" });

  // Get Document ID
  const userDocument = await client.fetch(groqQuery, {
    idFromSession,
  });

  // Get updated user in real time
  const user = await client.getDocument(userDocument._id);

  // le password n'a pas été changé
  if (!password) {
    await client
      .patch(user._id)

      .set({ given_name: firstName, family_name: lastName, email })
      .commit()
      .then((updatedUser) => {
        console.log("User account has been updated : ");
        console.log(updatedUser);
        res.json({
          result: true,
          message: "User account has been updated",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({ result: false, error });
      });
  } else {
    // password has not been modified
    await client
      .patch(user._id)
      .set({
        given_name: firstName,
        family_name: lastName,
        email,
        password: bcrypt.hashSync(password, 10),
      })
      .commit()
      .then((updatedUser) => {
        console.log("User account have been updated : ");
        console.log(updatedUser);
        res.json({
          result: true,
          message: "User account and password have been updated",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({ result: false, error });
      });
  }
};
