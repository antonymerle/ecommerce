import { useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "@/context/StateContext";
import { runFireworks } from "@/lib/utils";

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
  }, []);

  return (
    <div className="success-wrapper">
      <div className="success">
        <BsBagCheckFill
          size="12rem"
          color="green"
          style={{ padding: "2rem" }}
        />

        <h2>Merci pour votre commande !</h2>
        <p className="email-msg">
          Un email de confirmation vous a été expédié.
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

export default Success;
