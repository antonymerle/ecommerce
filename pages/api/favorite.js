import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { client } from "./auth/[...nextauth]";
import product from "@/sanity_ecommerce/schemas/product";

export default async (req, res) => {
  const rawSession = await getServerSession(req, res, authOptions);
  // handling the non-serializable object throwed by getServerSideProps (sigh)
  const userSession = JSON.parse(JSON.stringify(rawSession));
  console.log("getServerSession");
  console.log({ userSession });
  if (userSession && req.method === "POST") {
    const { productId } = req.body;
    console.log(productId);

    const groqQuery = `*[_type == "user" && email == $emailFromSession][0]`; // Query to fetch user with matching providerId and their ratedProducts array

    const emailFromSession = userSession?.session?.user?.email ?? "";

    console.log({ emailFromSession });

    if (!emailFromSession)
      return res.status(403).json({ error: "User not found" });

    const user = await client.fetch(groqQuery, {
      emailFromSession,
    });

    console.log({ user });

    let newFavoriteProduct = null;

    let isProductAlreadyFaved = false;

    if (
      user.favorites &&
      user.favorites.filter((p) => p.product._ref == productId).length > 0
    ) {
      console.log({ userFavorites: user.favorites });
      isProductAlreadyFaved = true;
    }

    console.log({ isProductAlreadyFaved });
    console.log({ favorites: user.favorites });

    if (!isProductAlreadyFaved) {
      // Form a new object with the product reference and the rating
      (newFavoriteProduct = {
        product: { _ref: productId, _type: "reference" },
        isFaved: true,
      }),
        // Update DB by creating a new array of rated products and pushing the object in it
        await client
          .patch(user._id)
          .setIfMissing({ favorites: [] })
          .append("favorites", [newFavoriteProduct])
          .commit({ autoGenerateArrayKeys: true })
          .then((updatedUser) => {
            console.log("New favorite has been saved : ", productId);
            console.log(updatedUser);
            res.json({
              result: true,
              product: product.name,
            });
          })
          .catch((error) => {
            console.log(error);
            res.json({ result: false, error });
          });
    } else {
      // remove fav
      console.log("remove fav");

      let favoriteToDelete = [];

      for (let fav of user.favorites) {
        if (String(fav.product._ref) == String(productId)) {
          console.log(`${fav.product._ref} == ${productId}`);

          favoriteToDelete.push(fav);
        }
      }

      console.log({ productId });

      favoriteToDelete.forEach((f) => console.log(f.product));

      console.log({ favoriteToDelete });

      // const favedProductIndex = user.favorites.findIndex(
      //   (el) => el.product._ref == productId
      // );

      // const favToRemove = [`favorites[${favedProductIndex}]`];

      // console.log({ favToRemove });

      const deleteQuery = `favorites[_key=="${favoriteToDelete[0]._key}"]`;

      console.log(deleteQuery);
      await client
        .patch(user._id)
        // .set({ favorites: [...updatedFavorites] })
        .unset([deleteQuery])
        .commit()
        .then((updatedUser) => {
          console.log("New favorite has been removed : ");
          console.log(updatedUser);
          res.json({
            result: true,
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({ result: false, error });
        });
    }
  } else {
    res.status(400).end();
  }
};
