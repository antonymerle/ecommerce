import { useState } from "react";
import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import { computeMean } from "@/lib/utils";
import style from "../styles/Ratings.module.css";

const { ratings, gold } = style;

const Ratings = ({ product }) => {
  const [isStarHovered, setIsStarHovered] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // turn stars to gold or returns them in their original state
  const midas = (index) => {
    return isStarHovered.map((star, i) => {
      if (i <= index) {
        return true;
      }
    });
  };

  const mean = computeMean(product.ratings);
  const STAR_MAX = 5;
  let stars = [];

  for (let i = 0; i < STAR_MAX; i++) {
    if (i < mean && mean < i + 1) {
      stars.push(
        <MdStarHalf
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    } else if (i < mean) {
      stars.push(
        <MdStar
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    } else {
      stars.push(
        <MdStarOutline
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    }
  }

  return (
    <div className={ratings}>
      <div>{stars}</div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
