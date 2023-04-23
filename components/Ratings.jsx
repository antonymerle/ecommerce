import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import style from "../styles/Ratings.module.css";

const { ratings } = style;

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
      <p>(20)</p>
    </div>
  );
};

export default Ratings;
