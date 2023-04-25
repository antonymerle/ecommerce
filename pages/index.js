import Product from "../components/Product";
import FooterBanner from "../components/FooterBanner";
import UpperBanner from "../components/UpperBanner";
import { client } from "@/lib/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const Home = ({ banner, products, footerBanner, userSession }) => {
  console.log(userSession);
  return (
    <>
      <UpperBanner heroBanner={banner.length && banner[0]} />
      <div className="products-heading">
        <h2>Meilleures ventes du moment</h2>
        <p>Découvrez les dernières tendances</p>
      </div>
      <div className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
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

  const userSession = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  // console.log({ session });

  return {
    props: {
      products,
      banner,
      footerBanner,
      userSession,
    },
  };
}

export default Home;
