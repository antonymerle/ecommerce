import { FaHeart, FaRegHeart } from "react-icons/fa";

const Heart = ({ isProductFaved }) => {
  console.log({ isProductFaved });
  !isProductFaved ?? true;
  return isProductFaved ? (
    <FaHeart onClick={() => console.log("unfaved")} />
  ) : (
    <FaRegHeart onClick={() => console.log("faved")} />
  );
};

export default Heart;
