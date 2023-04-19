import Link from "next/link";
import { client } from "@/lib/client";
import { useNextSanityImage } from "next-sanity-image";
import { urlFor } from "@/lib/client";

const HeroBanner = ({ heroBanner }) => {
  const imageProps = useNextSanityImage(client, heroBanner.image);

  return (
    <div className="hero-banner-container">
      <div>
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <img
          src={urlFor(heroBanner.image)}
          className="hero-banner-image"
          alt={heroBanner.product}
        />
        <div>
          <Link href={`/product/${heroBanner.product}`}>
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
          <div className="desc">
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
