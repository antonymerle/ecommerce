import { createContext, useContext, useState, useEffect } from "react";

const Context = createContext();

export const stateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [totalQuantities, setTotalQuantities] = useState();
  const [qty, setQty] = useState(1);

  const increaseQty = (prevQty) => ++prevQty;
  const decreaseQty = (prevQty) => (prevQty > 1 ? --prevQty : prevQty);

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </Context.Provider>
  );
};
