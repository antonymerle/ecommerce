import Link from "next/link";
import { MdRemoveShoppingCart } from "react-icons/md";

const Canceled = () => {
  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <MdRemoveShoppingCart
            size="12rem"
            color="#e94e77"
            style={{ padding: "2rem" }}
          />
        </p>
        <h2>La commande a échoué !</h2>
        <p className="email-msg">
          Vous n'avez pas été débité. Les articles dans votre panier ont été
          sauvegardés.
        </p>
        <p className="description">
          Pour toute question, n'hésitez pas à nous écrire à cette adresse :{" "}
          <a href="mailto:order@example.com" className="email">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="btn" width="300px" className="btn">
            Continuer mes achats
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Canceled;
