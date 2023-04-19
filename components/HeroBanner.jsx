import Link from "next/link";
import { urlFor } from "@/lib/client";

const HeroBanner = ({
  heroBanner: {
    smallText,
    midText,
    largeText,
    product,
    buttonText,
    discount,
    desc,
    image,
  },
}) => {
  return (
    <div className="hero-banner-container">
      <div className="hero-banner-main-text">
        <p>{smallText}</p>
        <h3>{midText}</h3>
        <h1>{largeText}</h1>
        <Link href={`/product/${product}`}>
          <button type="button">{buttonText}</button>
        </Link>
      </div>

      <div className="hero-banner-image-container">
        <img src={urlFor(image)} className="hero-banner-image" alt={product} />
        <div className="desc">
          <h5>{discount}</h5>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
