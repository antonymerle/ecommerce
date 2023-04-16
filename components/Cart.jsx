import { useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { Toast } from "react-hot-toast";

import { useStateContext } from "@/context/StateContext";
import { useNextSanityImage } from "next-sanity-image";
import Link from "next/link";

const Cart = () => {
  const cartRef = useRef();
  const { setShowCart, cartItems, totalPrice, totalQuantities } =
    useStateContext();
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <div className="span cart-num-items">({totalQuantities} items)</div>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty !</h3>
            <Link href="/">
              <button className="btn" onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
