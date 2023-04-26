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
}) => {
  // console.log({ userRatedProducts });

  const { updateUserRatings } = useStateContext();

  useEffect(() => {
    updateUserRatings(userRatedProducts);
  }, [userRatedProducts]);

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

  // console.log({ userRatedProducts });

  // console.log({ session });

  return {
    props: {
      products,
      banner,
      footerBanner,
      userSession,
      userRatedProducts,
    },
  };
}

export default Home;
