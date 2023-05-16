import Product from "../components/Product";
import FooterBanner from "../components/FooterBanner";
import UpperBanner from "../components/UpperBanner";
import { client } from "@/lib/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useStateContext } from "@/context/StateContext";
import { useEffect } from "react";

const Home = ({
  banner,
  products,
  footerBanner,
  userSession,
  userRatedProducts,
  userFavoritesProducts,
}) => {
  console.log({ userFavoritesProducts });

  const { updateUserRatings, updateUserFavorites, populateUserSession } =
    useStateContext();

  console.log({ userSession });

  useEffect(() => {
    updateUserRatings(userRatedProducts);
    updateUserFavorites(userFavoritesProducts);
    populateUserSession(userSession);
  }, [userRatedProducts, userSession]);

  return (
    <>
      <UpperBanner heroBanner={banner.length && banner[0]} />
      <div className="products-heading">
        <h2>Meilleures ventes du moment</h2>
        <p>Découvrez les dernières tendances</p>
      </div>
      <div className="products-container">
        {products?.map((product) => (
          <Product
            key={product._id}
            product={product}
            userRatedProducts={userRatedProducts}
          />
        ))}
      </div>
      <FooterBanner footerBanner={footerBanner && footerBanner[0]} />
    </>
  );
};

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

  // retrieve this specific user ratings based on his email
  const user = await client.fetch(
    `*[_type == "user" && email == "${userSession?.user?.email}"][0]`
  );

  console.log(user);

  const userRatedProducts = (await user?.ratedProducts) ?? [];
  const userFavoritesProducts = (await user?.favorites) ?? [];
  // TODO retrieve user favorite products

  // console.log({ userRatedProducts });

  // console.log({ session });

  return {
    props: {
      products,
      banner,
      footerBanner,
      userSession,
      userRatedProducts,
      userFavoritesProducts,
    },
  };
}

export default Home;
