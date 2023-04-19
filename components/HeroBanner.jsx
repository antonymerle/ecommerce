import Link from "next/link";
import { urlFor } from "@/lib/client";

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <div className="hero-banner-main-text">
        <p>{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <Link href={`/product/${heroBanner.product}`}>
          <button type="button">{heroBanner.buttonText}</button>
        </Link>
      </div>

      <div className="hero-banner-image-container">
        <img
          src={urlFor(heroBanner.image)}
          className="hero-banner-image"
          alt={heroBanner.product}
        />
        <div className="desc">
          <h5>{heroBanner.discount}</h5>
          <p>{heroBanner.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
