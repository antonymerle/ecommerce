import Product from "./Product";

const ProductsContainer = ({ userFavoritesProducts, userRatedProducts }) => {
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

export default ProductsContainer;
