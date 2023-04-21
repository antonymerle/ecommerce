import { useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { urlFor } from "@/lib/client";
import { useStateContext } from "@/context/StateContext";
import Link from "next/link";
import getStripe from "@/lib/getStripe";
import styles from "../styles/Cart.module.css";

const {
  cartWrapper,
  cartContainer,
  cartHeading,
  cartNumItems,
  emptyCart,
  productContainer,
  productClass,
  cartProductImage,
  itemDesc,
  quantityDesc,
  minus,
  num,
  plus,
  removeItem,
  top,
  flex,
  bottom,
  cartBottom,
  total,
} = styles;

const Cart = () => {
  const cartRef = useRef();
  const {
    setShowCart,
    cartItems,
    totalPrice,
    totalQuantities,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ cartItems }),
    });
    if (response.status >= 400) {
      return;
    }

    const data = await response.json();
    toast.loading("Redirecting...");
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className={cartWrapper} ref={cartRef}>
      <div className={cartContainer}>
        <button
          type="button"
          className={cartHeading}
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          {/* TODO : remove class */}
          <span className="heading">Votre panier</span>
          <div className={cartNumItems}>
            ({totalQuantities} {totalQuantities > 1 ? "articles" : "article"})
          </div>
        </button>
        {cartItems.length < 1 && (
          <div className={emptyCart}>
            <AiOutlineShopping size={150} />
            <h3>Votre panier est vide !</h3>
            <Link href="/">
              <button className="btn" onClick={() => setShowCart(false)}>
                Poursuivre mes achats
              </button>
            </Link>
          </div>
        )}
        <div className={productContainer}>
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className={productClass} key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className={cartProductImage}
                />
                <div className={itemDesc}>
                  <div className={`${flex} ${top}`}>
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className={`${flex} ${bottom}`}>
                    <div>
                      <p className={quantityDesc}>
                        <span
                          className={minus}
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className={num}>{item.quantity}</span>
                        <span
                          className={plus}
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className={removeItem}
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className={cartBottom}>
            <div className={total}>
              <h3>Total:</h3>
              <h3>{totalPrice}€</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Payer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
