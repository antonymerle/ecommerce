import { useState, useEffect } from "react";
import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import { computeMean } from "@/lib/utils";
import style from "../styles/Ratings.module.css";
import { useStateContext } from "@/context/StateContext";

const { ratings, gold } = style;

// TODO : rec user rating in local state and account
// TODO : rec user rating in DB

const Ratings = ({ product }) => {
  const { userRatings } = useStateContext();
  const [isStarHovered, setIsStarHovered] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [userStars, setUserStars] = useState([]);

  useEffect(() => {
    if (userRatings && userRatings.length > 0) {
      const userRating = userRatings.filter((r) => {
        console.log(
          `${r?.product?._ref} == ${product._id} : ${
            r?.product?._ref == product._id
          }`
        );
        return r?.product?._ref == product._id;
      });

      if (userRating.length > 0) {
        const goldenStars = fillMidas(userRating[0].rate - 1);
        console.log({ goldenStars });
        setUserStars(goldenStars);
      } else {
        setUserStars([]);
      }
    }
  }, [product.slug, userRatings]);

  const mean = computeMean(product.ratings);
  const STAR_MAX = 5;

  // We use this array to translate the aggregate notations (1 to 5) from all users in stars.
  let aggregateStars = [];

  // turn stars to gold on hover, then returns them in their original state
  const hoverMidas = (index) => {
    return isStarHovered.map((star, i) => {
      if (i <= index) {
        return true;
      }
    });
  };

  // turn stars to gold
  const fillMidas = (index) => {
    const filledGoldenStars = [];
    for (let i = 0; i < STAR_MAX; i++) {
      if (i <= index) filledGoldenStars.push(true);
      else {
        filledGoldenStars.push(false);
      }
    }
    return filledGoldenStars;
  };

  const handleRate = (index) => {
    const goldenStars = fillMidas(index);
    setUserStars(goldenStars);
    const starsNumber = index + 1;
    handleRequest(starsNumber);
  };

  const handleRequest = (starsNumber) => {
    fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        starsNumber,
        productId: product._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  for (let i = 0; i < STAR_MAX; i++) {
    if (i < mean && mean < i + 1) {
      aggregateStars.push(
        <MdStarHalf
          onMouseOver={() => {
            setIsStarHovered(hoverMidas(i));
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
      aggregateStars.push(
        <MdStar
          onMouseOver={() => {
            setIsStarHovered(hoverMidas(i));
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
      aggregateStars.push(
        <MdStarOutline
          onMouseOver={() => {
            setIsStarHovered(hoverMidas(i));
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
                    setIsStarHovered(hoverMidas(i));
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
                    setIsStarHovered(hoverMidas(i));
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
          : aggregateStars}
      </div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
