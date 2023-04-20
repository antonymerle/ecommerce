import Link from "next/link";
import { urlFor } from "@/lib/client";
import styles from "../styles/UpperBanner.module.css";

const UpperBanner = ({
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
    <div className={styles.container}>
      <div className={styles.mainText}>
        <p>{smallText}</p>
        <h3>{midText}</h3>
        <h1>{largeText}</h1>
        <Link href={`/product/${product}`}>
          <button type="button">{buttonText}</button>
        </Link>
      </div>

      <div className={styles.imageContainer}>
        <img src={urlFor(image)} className={styles.image} alt={product} />
        <div className={styles.description}>
          <h5>{discount}</h5>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default UpperBanner;
