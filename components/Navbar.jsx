import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import Cart from "./Cart";
import { useStateContext } from "@/context/StateContext";
import style from "../styles/Navbar.module.css";
import UserModal from "./UserModal";

const { navbarContainer, logo, cartIcon, navIcons, cartItemQty } = style;

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className={navbarContainer}>
      <p className={logo}>
        <Link href="/">Artefacts e-commerce</Link>
      </p>

      <div className={navIcons}>
        <UserModal />
        <button
          type="button"
          className={cartIcon}
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping size={24} color="grey" />
          <span className={cartItemQty}>{totalQuantities}</span>
        </button>
      </div>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
