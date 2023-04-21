import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";
import styles from "../styles/Cart.module.css";

const { quantityDesc, minus, num, plus } = styles;

// Two different logics wether if the component is in the Cart component or slug page.
// context parameter is either "cart" or "slug"
// If context === "cart", cartItem must be provided
const Quantity = ({ context, cartItem }) => {
  if (context === "cart" && cartItem) {
    const { toggleCartItemQuantity } = useStateContext();
    return (
      <p className={quantityDesc}>
        <span
          className={minus}
          onClick={() => toggleCartItemQuantity(cartItem._id, "dec")}
        >
          <AiOutlineMinus />
        </span>
        <span className={num}>{cartItem.quantity}</span>
        <span
          className={plus}
          onClick={() => toggleCartItemQuantity(cartItem._id, "inc")}
        >
          <AiOutlinePlus />
        </span>
      </p>
    );
  } else if (context === "slug") {
    const { qty, decQty, incQty } = useStateContext();
    return (
      <p className={quantityDesc}>
        <span className={minus} onClick={decQty}>
          <AiOutlineMinus />
        </span>
        <span className={num}>{qty}</span>
        <span className={plus} onClick={incQty}>
          <AiOutlinePlus />
        </span>
      </p>
    );
  } else {
    return <p>Error</p>;
  }
};

export default Quantity;
