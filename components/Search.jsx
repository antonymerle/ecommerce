import { useState } from "react";
import Product from "./Product";
import { BsSearch } from "react-icons/bs";
import style from "../styles/Search.module.css";

const { searchResults, container, searchBox, inputContainer } = style;

const Search = ({ products }) => {
  const [search, setSearch] = useState("");

  const results =
    search.length > 1
      ? products
          ?.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => {
            return <Product key={product._id} product={product} />;
          })
      : null;

  return (
    <div className={container}>
      <div className={inputContainer}>
        <input
          className={searchBox}
          placeholder="Rechercher dans la boutique"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <BsSearch size={"30px"} color={"#324d67"} />
      </div>
      <div className={searchResults}>{results}</div>
    </div>
  );
};

export default Search;
