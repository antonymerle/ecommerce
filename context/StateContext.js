import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { computeTTC } from "@/lib/utils";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [userRatings, setUserRatings] = useState([]);
  const [userFavs, setUserFavs] = useState([]);
  const [userSession, setUserSession] = useState(null);

  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice + computeTTC(product.priceHT, product.tax) * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} ajouté au panier.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice -
        computeTTC(foundProduct.priceHT, foundProduct.tax) *
          foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);
      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice + computeTTC(foundProduct.priceHT, foundProduct.tax)
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        setTotalPrice(
          (prevTotalPrice) =>
            prevTotalPrice - computeTTC(foundProduct.priceHT, foundProduct.tax)
        );
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  const updateUserRatings = (ratedProducts) => {
    setUserRatings(ratedProducts);
  };

  const updateUserFavorites = (favoriteProducts) => {
    const merged = [...userFavs, ...favoriteProducts];
    setUserFavs(Array.from(new Set(merged)));
  };

  const addUserFavorite = (productId) => {
    setUserFavs([...userFavs, productId]);
  };

  const removeUserFavorite = (productId) => {
    setUserFavs(userFavs.filter((fav) => fav !== productId));
  };

  const populateUserSession = (sessionObject) => {
    setUserSession(sessionObject);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        updateUserRatings,
        userFavs,
        updateUserFavorites,
        addUserFavorite,
        removeUserFavorite,
        userRatings,
        populateUserSession,
        userSession,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
