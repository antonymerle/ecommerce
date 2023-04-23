import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
import Cart from "./Cart";
import { useStateContext } from "@/context/StateContext";
import LoginBtn from "./LoginBtn";
import style from "../styles/Navbar.module.css";

const { navbarContainer, logo, cartIcon, userIcon, cartItemQty } = style;

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className={navbarContainer}>
      <p className={logo}>
        <Link href="/">Artefacts e-commerce</Link>
      </p>
      <button type="button" className={userIcon}>
        <MdOutlineAccountCircle />
      </button>

      <LoginBtn />
      <button
        type="button"
        className={cartIcon}
        onClick={() => setShowCart(true)}
      >
        <AiOutlineShopping size={24} color="grey" />
        <span className={cartItemQty}>{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
