import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStateContext } from "@/context/StateContext";

const Heart = ({ productId }) => {
  const [isProductFaved, setIsProductFaved] = useState(false);
  const { userSession, userFavs } = useStateContext();

  useEffect(() => {
    const checkIfProducIsFaved =
      userFavs.filter((p) => p._id === productId).length === 1;
    setIsProductFaved(checkIfProducIsFaved);
  }, [userFavs, userSession]);

  const handleRequest = () => {
    fetch("/api/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  console.log({ productId });

  return isProductFaved ? (
    <FaHeart onClick={handleRequest} />
  ) : (
    <FaRegHeart onClick={handleRequest} />
  );
};

export default Heart;
