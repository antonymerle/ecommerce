import { useStateContext } from "@/context/StateContext";
import Product from "./Product";

const Favorites = ({ userFavoritesProducts, userRatedProducts }) => {
  // const [first, setfirst] = useState(second)
  console.log({ userFavoritesProducts });
  const { userSession, userRatings } = useStateContext();

  return (
    <div className="products-container">
      {userFavoritesProducts?.map((product) => (
        <Product
          key={product._id}
          product={product}
          userRatedProducts={userRatedProducts}
        />
      ))}
    </div>
  );
};

export default Favorites;
