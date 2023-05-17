import Product from "./Product";

const ProductsContainer = ({ productsArray, userRatedProducts }) => {
  return (
    <div className="products-container">
      {productsArray?.map((product) => (
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
