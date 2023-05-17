import Favorites from "@/components/Favorites";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { client } from "@/lib/client";

const favorites = ({ userFavoritesProducts, userRatedProducts }) => {
  return <Favorites userFavoritesProducts={userFavoritesProducts} />;
};

export default favorites;

export async function getServerSideProps(context) {
  const banner = await client.fetch(`*[_type == "upperBanner"]`);
  const products = await client.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))]`
  );
  const footerBanner = await client.fetch(`*[_type == "footerBanner"]`);

  let userSession = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // handling the non-serializable object throwed by getServerSideProps (sigh)
  userSession = JSON.parse(JSON.stringify(userSession));

  console.log({ email: userSession?.session?.user?.email });

  /* Important : USE client.getDocument, not use client.fetch to retrieve user data in real time OR BUGS due to caching will occur.
      https://www.sanity.io/docs/js-client#fetch-a-single-document
      This will fetch a document from the Doc endpoint.
      This endpoint cuts through any caching/indexing middleware that may involve
      delayed processing.
      */
  const userDoc = await client.fetch(
    `*[_type == "user" && email == "${userSession?.session?.user?.email}"][0]`
  );

  let user;
  if (userDoc) {
    user = await client.getDocument(userDoc?._id);
  }

  console.log({ user });

  const userFavoritesProductsRefs =
    (await user?.favorites?.map((fav) => fav.product._ref)) ?? [];
  // TODO retrieve user favorite products

  // console.log({ userRatedProducts });
  console.log({ userFavoritesProductsRefs });

  const userFavoritesProducts = await client.getDocuments(
    userFavoritesProductsRefs
  );

  console.log({ userFavoritesProductsRefs });
  // console.log({ session });

  const userRatedProducts = (await user?.ratedProducts) ?? [];

  return {
    props: {
      userFavoritesProducts,
      userRatedProducts,
    },
  };
}
