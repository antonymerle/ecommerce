import Link from "next/link";
import { urlFor } from "@/lib/client";
import styles from "../styles/FooterBanner.module.css";

const FooterBanner = ({
  footerBanner: {
    discount,
    largeText1,
    largeText2,
    saleTime,
    smallText,
    midText,
    desc,
    product,
    buttonText,
    image,
  },
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.mainTextContainer}>
        <p>{discount}</p>
        <h3>{largeText1}</h3>
        <h3>{largeText2}</h3>
        <p>{saleTime}</p>
      </div>
      <div className={styles.imageContainer}>
        <img src={urlFor(image)} />
      </div>
      <div className={styles.secondaryTextContainer}>
        <p>{smallText}</p>
        <h3>{midText}</h3>
        <p>{desc}</p>
        <Link href={`/product/${product}`}>
          <button type="button">{buttonText}</button>
        </Link>
      </div>
    </div>
  );
};

export default FooterBanner;
