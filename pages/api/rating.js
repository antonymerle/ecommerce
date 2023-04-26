import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { client } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log({ session });
  if (session && req.method === "POST") {
    const { starsNumber, productId } = req.body;
    console.log(starsNumber, productId);

    const groqQuery = `*[_type == "user" && email == $sesionEmail][0]`; // Query to fetch user with matching providerId and their ratedProducts array

    const user = await client.fetch(groqQuery, {
      sesionEmail: session.user.email,
    });

    let newRatedProduct = null;

    if (!user.ratedProducts) {
      console.log("empty array");
      // The product has not been rated before, fetch it
      const product = await client.fetch(
        `*[_type == "product" && _id == $productId][0]`,
        { productId }
      );

      // Form a new object with the product reference and the rating
      newRatedProduct = {
        product: { _ref: product._id, _type: "reference" },
        rate: starsNumber,
      };

      // Update DB by creating a new array of rated products and pushing the object in it
      await client
        .patch(user._id)
        .setIfMissing({ ratedProducts: [] })
        .append("ratedProducts", [newRatedProduct])
        // .set({ ratedProducts: user.ratedProducts })
        .commit({ autoGenerateArrayKeys: true })
        .then((updatedUser) => {
          console.log("New rate has been saved : ", starsNumber);
          console.log(updatedUser);
          res.json({
            result: true,
            rate: starsNumber,
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({ result: false, error });
        });
    } else {
      // The user has already an array with notations in it.
      // Find the index of the ratedProduct in the user's ratedProducts array based on the product ID
      const ratedProductIndex = user.ratedProducts.findIndex(
        (el) => el.product._ref == productId
      );

      // Update the rate field in the ratedProduct object
      if (ratedProductIndex !== -1) {
        user.ratedProducts[ratedProductIndex].rate = starsNumber;
      } else {
        // If the product has not been rated before, fetch the product reference
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0]`,
          { productId }
        );

        // Form a new object with the product reference and the rating
        const newRatedProduct = {
          product: { _ref: product._id, _type: "reference" },
          rate: starsNumber,
        };

        // Push the new ratedProduct object to the ratedProducts array
        user.ratedProducts.push(newRatedProduct);
      }

      // Update the user in the sanity database
      await client
        .patch(user._id)
        .setIfMissing({ ratedProducts: [] })
        .set({ ratedProducts: user.ratedProducts })
        .commit({ autoGenerateArrayKeys: true })
        .then((updatedUser) => {
          console.log("New rate has been saved : ", starsNumber);
          console.log(updatedUser);
          res.json({
            result: true,
            rate: starsNumber,
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({ result: false, error });
        });
    }
  } else {
    res.redirect("/unauthorized");
  }
  res.end();
};
