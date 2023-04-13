import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { client } from "@/lib/client";

const Product = ({ product: { image, name, slug, price } }) => {
  const imageProps = useNextSanityImage(client, image && image[0]);

  console.log(image);
  console.log(image[0]);

  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <Image
            {...imageProps}
            className="product-image"
            width={250}
            height={250}
          />
          <p className="product-name">{name}</p>
          <p className="product-price">{price}€</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
