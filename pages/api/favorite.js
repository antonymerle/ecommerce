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

    /* Important : USE getDocument to retrieve user data in real time OR BUGS due to caching will occur.
      https://www.sanity.io/docs/js-client#fetch-a-single-document
      This will fetch a document from the Doc endpoint.
      This endpoint cuts through any caching/indexing middleware that may involve
      delayed processing.
      */

    // Get Document ID
    const userDocument = await client.fetch(groqQuery, {
      emailFromSession,
    });

    // Get updated user in real time

    const user = await client.getDocument(userDocument._id);

    console.log({ user });

    let newFavoriteProduct = null;

    let isProductAlreadyFaved = false;

    console.log({
      userFavLength: user.favorites?.filter((p) => p.product._ref == productId)
        .length,
    });
    // TODO : cette condition ne s'applique pas quand on a déjà fav un produit
    if (
      (await user.favorites?.filter((p) => p.product._ref == productId)
        .length) > 0
    ) {
      console.log({ userFavorites: user.favorites });
      isProductAlreadyFaved = true;
    }

    console.log({ isProductAlreadyFaved });
    console.log({ favorites: user.favorites });

    if (isProductAlreadyFaved === false) {
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
              productId,
              faved: true,
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

      const favedProductIndex = user.favorites.findIndex(
        (el) => el.product._ref == productId
      );

      const favToRemove = `favorites[${favedProductIndex}]`;

      // console.log({ favToRemove });

      const updatedFavorites = user.favorites.filter(
        (fav) => fav.product._ref != productId
      );

      console.log({ updatedFavorites });

      const deleteQuery = `favorites[_key=="${favoriteToDelete[0]._key}"]`;

      console.log(deleteQuery);
      await client
        .patch(user._id)
        // .set({ favorites: updatedFavorites })
        .unset([favToRemove])
        .commit()
        .then((updatedUser) => {
          console.log("New favorite has been removed : ");
          console.log(updatedUser);
          res.json({
            productId,
            faved: false,
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
  res.end();
};
