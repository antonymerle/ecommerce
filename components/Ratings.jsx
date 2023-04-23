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
  return (
    <div className={ratings}>
      <div>
        <MdStar />
        <MdStar />
        <MdStar />
        <MdStar />
        <MdStarOutline />
      </div>
      <p>{computeMean(product.ratings)}</p>
    </div>
  );
};

export default Ratings;
