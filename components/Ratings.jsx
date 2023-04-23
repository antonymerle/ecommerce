import { useState } from "react";
import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import { computeMean } from "@/lib/utils";
import style from "../styles/Ratings.module.css";

const { ratings } = style;

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

  return (
    <div className={ratings}>
      <div>{stars}</div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
