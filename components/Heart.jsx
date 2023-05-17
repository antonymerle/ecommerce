import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStateContext } from "@/context/StateContext";

const Heart = ({ productId }) => {
  const [isProductFaved, setIsProductFaved] = useState(false);
  const {
    userSession,
    userFavs,
    updateUserFavorites,
    addUserFavorite,
    removeUserFavorite,
  } = useStateContext();

  useEffect(() => {
    console.log({ userFavs, productId });
    setIsProductFaved(isFaved(productId));
  }, []);

  const isFaved = (productId) => {
    return userFavs.filter((p) => p === productId).length === 1;
  };

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
