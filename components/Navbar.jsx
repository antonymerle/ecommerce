import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <p>
        <Link href="/">JSM Headphones</Link>
      </p>
      <button
        type="button"
        className="cart-icon"
        onClick={() => console.log("click")}
      >
        <AiOutlineShopping />
        <span className="cart-item-qty">1</span>
      </button>
    </div>
  );
};

export default Navbar;
