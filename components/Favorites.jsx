import { useStateContext } from "@/context/StateContext";
import ProductsContainer from "./ProductsContainer";
import style from "../styles/Favorites.module.css";

const { container, title } = style;

const Favorites = ({ userFavoritesProducts, userRatedProducts }) => {
  // const [first, setfirst] = useState(second)
  console.log({ userFavoritesProducts });
  const { userSession, userRatings } = useStateContext();

  return (
    <div className={container}>
      <h1 className={title}>Mes favoris</h1>
      <ProductsContainer
        productsArray={userFavoritesProducts}
        userRatedProducts={userRatedProducts}
      />
    </div>
  );
};

export default Favorites;
