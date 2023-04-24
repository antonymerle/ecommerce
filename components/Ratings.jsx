import { useState, useEffect } from "react";
import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import { computeMean } from "@/lib/utils";
import style from "../styles/Ratings.module.css";

const { ratings, gold } = style;

// TODO : rec user rating in local state and account
// TODO : rec user rating in DB

const Ratings = ({ product }) => {
  const [isStarHovered, setIsStarHovered] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [userStars, setUserStars] = useState([]);

  useEffect(() => {
    setUserStars([]);
  }, [product.slug]);

  const mean = computeMean(product.ratings);
  const STAR_MAX = 5;
  let starsFromBackend = [];

  // turn stars to gold or returns them in their original state
  const midas = (index) => {
    return isStarHovered.map((star, i) => {
      if (i <= index) {
        return true;
      }
    });
  };

  const handleRate = (index) => {
    const result = [];
    for (let i = 0; i < STAR_MAX; i++) {
      if (i <= index) result.push(true);
      else {
        result.push(false);
      }
      setUserStars(result);
    }
  };

  for (let i = 0; i < STAR_MAX; i++) {
    if (i < mean && mean < i + 1) {
      starsFromBackend.push(
        <MdStarHalf
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          onClick={() => {
            handleRate(i);
          }}
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    } else if (i < mean) {
      starsFromBackend.push(
        <MdStar
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          onClick={() => {
            handleRate(i);
          }}
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    } else {
      starsFromBackend.push(
        <MdStarOutline
          onMouseOver={() => {
            setIsStarHovered(midas(i));
          }}
          onMouseLeave={() =>
            setIsStarHovered([false, false, false, false, false])
          }
          onClick={() => {
            handleRate(i);
          }}
          key={i}
          color={isStarHovered[i] ? "gold" : ""}
        />
      );
    }
  }

  return (
    <div className={ratings}>
      <div>
        {userStars.length
          ? userStars.map((star, i) =>
              star ? (
                <MdStar
                  onMouseOver={() => {
                    setIsStarHovered(midas(i));
                  }}
                  onMouseLeave={() =>
                    setIsStarHovered([false, false, false, false, false])
                  }
                  onClick={() => {
                    handleRate(i);
                  }}
                  key={i}
                  color={"gold"}
                />
              ) : (
                <MdStarOutline
                  onMouseOver={() => {
                    setIsStarHovered(midas(i));
                  }}
                  onMouseLeave={() =>
                    setIsStarHovered([false, false, false, false, false])
                  }
                  onClick={() => {
                    handleRate(i);
                  }}
                  key={i}
                />
              )
            )
          : starsFromBackend}
      </div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
