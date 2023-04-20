import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import Cart from "./Cart";
import { useStateContext } from "@/context/StateContext";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className={styles.navbarContainer}>
      <p className={styles.logo}>
        <Link href="/">Artefacts e-commerce</Link>
      </p>
      <button
        type="button"
        className={styles.cartIcon}
        onClick={() => setShowCart(true)}
      >
        <AiOutlineShopping />
        <span className={styles.cartItemQty}>{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
