import bcrypt from "bcrypt";
import { client } from "./[...nextauth]";

export default async (req, res) => {
  const { email, password, formType } = req.body;
  console.log("signin endpoint reached");
  // console.log({ body: req.body });

  if (req.method !== "POST" || !email || !password || formType !== "signin") {
    console.log("Wrong request");

    return res.status(400).json({ result: false, error: "Wrong request" });
  }

  const groqQuery = `*[_type == "user" && email == $userEmail]`;

  const userinDB = await client.fetch(groqQuery, {
    userEmail: email,
  });

  console.log(userinDB);

  if (userinDB?.length) {
    console.log("User found in DB, checking password");
    if (bcrypt.compareSync(password, userinDB[0].password ?? "")) {
      console.log("passwords hashes match !");
      return res.status(200).json(userinDB[0]);
    } else {
      console.log("Passwords DO NOT match !");

      return res
        .status(401)
        .json({ result: false, error: "Mauvais identifiant / mot de passe." });
    }
  }

  res.status(400).json({ result: false, error: "User not found." });
};
