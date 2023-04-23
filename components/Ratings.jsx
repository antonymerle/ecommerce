import { useState } from "react";
import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import style from "../styles/Ratings.module.css";

const { ratings } = style;

const computeMean = (arr) => {
  if (!arr) return 0;
  const mean = arr.reduce((sum, current) => sum + current, 0) / arr.length;
  return Math.round(mean * 10) / 10;
};

const Ratings = ({ product }) => {
  const mean = computeMean(product.ratings);
  const STAR_MAX = 5;
  let stars = [];

  for (let i = 0; i < STAR_MAX; i++) {
    if (i < mean && mean < i + 1) {
      stars.push(<MdStarHalf />);
    } else if (i < mean) {
      stars.push(<MdStar />);
    } else {
      stars.push(<MdStarOutline />);
    }
  }
  console.log(mean);

  return (
    <div className={ratings}>
      <div>{stars}</div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
