import Product from "./Product";

const Search = ({ products }) => {
  console.log(products);
  const results = products?.map((product) => {
    return <Product key={product._id} product={product} />;
  });

  return <div>{results}</div>;
};

export default Search;
