import { useStateContext } from "@/context/StateContext";
import ProductsContainer from "./ProductsContainer";

const Favorites = ({ userFavoritesProducts, userRatedProducts }) => {
  // const [first, setfirst] = useState(second)
  console.log({ userFavoritesProducts });
  const { userSession, userRatings } = useStateContext();

  return (
    <ProductsContainer
      userFavoritesProducts={userFavoritesProducts}
      userRatedProducts={userRatedProducts}
    />
  );
};

export default Favorites;
