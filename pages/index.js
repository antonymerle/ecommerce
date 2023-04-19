import Product from "../components/Product";
import FooterBanner from "../components/FooterBanner";
import HeroBanner from "../components/HeroBanner";
import { client } from "@/lib/client";

const Home = ({ banner, products, footerBanner }) => {
  return (
    <>
      <HeroBanner heroBanner={banner.length && banner[0]} />
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

export async function getServerSideProps() {
  const banner = await client.fetch(`*[_type == "upperBanner"]`);
  const products = await client.fetch(`*[_type == "product"]`);
  const footerBanner = await client.fetch(`*[_type == "footerBanner"]`);

  return {
    props: {
      products,
      banner,
      footerBanner,
    },
  };
}

export default Home;
