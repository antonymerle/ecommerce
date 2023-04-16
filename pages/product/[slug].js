import { useState } from "react";
import Image from "next/image";
import { client } from "@/lib/client";
import { useNextSanityImage } from "next-sanity-image";
import { useStateContext } from "@/context/StateContext";

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { Product } from "@/components";

const ProductDetails = ({ product, products }) => {
  const [index, setIndex] = useState(0);

  const { qty, increaseQty, decreaseQty, onAdd } = useStateContext();

  const { image, name, details, price } = product;
  const imageProps = useNextSanityImage(client, image && [...image][index]);

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <Image {...imageProps} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <Image
                {...useNextSanityImage(client, image && [...image][i])}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                key={i}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">${price}</p>

          <div className="quantity">
            <h3>Quantity :</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={() => onAdd(product, qty)}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => console.log("click")}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="buy-now"
              onClick={() => console.log("click")}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;
  const products = await client.fetch(query);
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

// querying data for the requested product only.
/*
This is possible because getStaticProps only runs on the server-side. 
It will never run on the client-side. It won’t even be included in the JS bundle for the browser. 
That means you can write code such as direct database queries without them being sent to browsers.
*/
export const getStaticProps = async ({ params: { slug } }) => {
  const product = await client.fetch(
    `*[_type == "product" && slug.current == "${slug}"][0]`
  );

  const products = await client.fetch(`*[_type == "product"]`);

  return {
    props: {
      product,
      products,
    },
  };
};

export default ProductDetails;
