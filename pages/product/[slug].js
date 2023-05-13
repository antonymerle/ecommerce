import { useState } from "react";
import { useStateContext } from "@/context/StateContext";
import { urlFor, client } from "../../lib/client";
import { computeTTC } from "@/lib/utils";
import Ratings from "@/components/Ratings";
import { Product } from "@/components";
import Quantity from "@/components/Quantity";

const ProductDetails = ({ product, products }) => {
  const [index, setIndex] = useState(0);
  const { qty, onAdd, setShowCart } = useStateContext();
  const { image, name, details, priceHT, tax, inventory } = product;

  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                src={urlFor(item)}
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
          {/* TODO : make reviews dynamic */}
          <Ratings product={product} />
          <h4>Détails:</h4>
          <p>{details}</p>
          <p className="price">{computeTTC(priceHT, tax).toFixed(2)}€</p>

          {inventory > 0 ? (
            <>
              <div className="quantity">
                <h3>Quantité :</h3>
                <Quantity context="slug" inventory={inventory} />
              </div>

              <div className="buttons">
                <button
                  type="button"
                  className="add-to-cart"
                  onClick={() => onAdd(product, qty)}
                >
                  Ajouter au panier
                </button>
                <button
                  type="button"
                  className="buy-now"
                  onClick={handleBuyNow}
                >
                  Acheter
                </button>
              </div>
            </>
          ) : (
            <p>Ce produit est indisponible.</p>
          )}
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>Vous aimerez aussi :</h2>
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
