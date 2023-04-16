import React from "react";
import Product from "../components/Product";
import FooterBanner from "../components/FooterBanner";
import HeroBanner from "../components/HeroBanner";
import { client } from "@/lib/client";

const Home = ({ banner, products }) => {
  console.log(products);

  return (
    <>
      <HeroBanner heroBanner={banner.length && banner[0]} />
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <FooterBanner footerBanner={banner && banner[0]} />
    </>
  );
};

export async function getServerSideProps() {
  const products = await client.fetch(`*[_type == "product"]`);
  const banner = await client.fetch(`*[_type == "banner"]`);

  return {
    props: {
      products,
      banner,
    },
  };
}

export default Home;
