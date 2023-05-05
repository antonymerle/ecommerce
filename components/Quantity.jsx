import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";
import styles from "../styles/Cart.module.css";

const { quantityDesc, minus, num, plus } = styles;

// Two different logics wether if the component is in the Cart component or slug page.
// context parameter is either "cart" or "slug"
// If context === "cart", cartItem must be provided
const Quantity = ({ context, cartItem }) => {
  const { qty, decQty, incQty, toggleCartItemQuantity } = useStateContext();

  if (context === "cart" && cartItem) {
    return (
      <div className={quantityDesc}>
        <div
          className={minus}
          onClick={() => toggleCartItemQuantity(cartItem._id, "dec")}
        >
          <AiOutlineMinus />
        </div>
        <div className={num}>{cartItem.quantity}</div>
        <div
          className={plus}
          onClick={() => toggleCartItemQuantity(cartItem._id, "inc")}
        >
          <AiOutlinePlus />
        </div>
      </div>
    );
  } else if (context === "slug") {
    return (
      <div className={quantityDesc}>
        <div className={minus} onClick={decQty}>
          <AiOutlineMinus />
        </div>
        <div className={num}>{qty}</div>
        <div className={plus} onClick={incQty}>
          <AiOutlinePlus />
        </div>
      </div>
    );
  } else {
    return <p>Error</p>;
  }
};

export default Quantity;
