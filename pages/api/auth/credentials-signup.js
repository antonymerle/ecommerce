import bcrypt from "bcrypt";
import { client } from "./[...nextauth]";

export default async (req, res) => {
  const { email, password, formType } = req.body;
  console.log("credentials-signup endpoint reached");
  if (req.method !== "POST" || !email || !password || formType !== "signup") {
    console.log("Wrong request");

    return res.status(400).json({ result: false, error: "Wrong request" });
  }

  const groqQuery = `*[_type == "user" && email == $userEmail]`;

  const userinDB = await client.fetch(groqQuery, {
    userEmail: email,
  });

  console.log(userinDB);

  if (userinDB?.length) {
    console.log("User already present in DB");
    return res.status(401).json({
      result: false,
      error: "Utilisateur déjà inscrit.",
    });
  } else {
    console.log("we register new user in DB");

    // we register new user in DB
    const newUser = {
      _type: "user",
      email: email,
      password: bcrypt.hashSync(password, 10),
      given_name: email.split("@")[0],
      provider: "credentials",
      providerId: "credentials",
      role: "customer",
    };
    client.create(newUser).then((response) => {
      console.log(
        `New user ${newUser.given_name} was created with credentials method and _id of ${response._id}`
      );
    });

    return res.status(200).json(newUser);
  }
};
