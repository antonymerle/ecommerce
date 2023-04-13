import React from "react";
import { Product, FooterBanner, HeroBanner } from "../components";
import { client } from "@/lib/client";

const Home = ({ banner, products }) => {
  return (
    <>
      <HeroBanner heroBanner={banner.length && banner[0]} />
      {console.log(banner)}
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products.map((product) => product.name)}
      </div>
      Footer
    </>
  );
};

export async function getStaticProps() {
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
