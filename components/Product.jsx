import Link from "next/link";
import { urlFor } from "@/lib/client";
import { computeTTC } from "@/lib/utils";
import style from "../styles/Product.module.css";

const { productCard, productImage, productName, productPrice } = style;

const Product = ({ product: { image, name, slug, priceHT, tax } }) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className={productCard}>
          <img
            src={urlFor(image && image[0])}
            className={productImage}
            width={250}
            height={250}
          />
          <p className={productName}>{name}</p>
          <p className={productPrice}>{computeTTC(priceHT, tax)}€</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
