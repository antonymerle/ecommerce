import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStateContext } from "@/context/StateContext";

const isFaved = (userFavs, productId) => {
  console.log({ userFavs, productId });
  const result = userFavs.includes(productId);
  console.log({ result });
  return result;
};

const Heart = ({ userFavs, productId }) => {
  const [isProductFaved, setIsProductFaved] = useState(false);
  const { addUserFavorite, removeUserFavorite } = useStateContext();

  // console.log({ userFavs, productId });

  useEffect(() => {
    // console.log(isFaved(userFavs, productId));
    setIsProductFaved(isFaved(userFavs, productId));
  }, [productId, userFavs]);

  const handleRequest = () => {
    setIsProductFaved(!isFaved(productId)); // Avoid latency from waiting server response
    fetch("/api/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.faved === true) {
          addUserFavorite(productId);
        } else {
          removeUserFavorite(productId);
        }
      });
  };

  // console.log({ productId });

  return isProductFaved ? (
    <FaHeart onClick={handleRequest} />
  ) : (
    <FaRegHeart onClick={handleRequest} />
  );
};

export default Heart;
