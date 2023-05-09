import { useEffect, useState } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "@/context/StateContext";
import { runFireworks } from "@/lib/utils";
import style from "../styles/Success.module.css";
import { useSearchParams } from "next/navigation";

const { successWrapper, success, icon, emailMsg, description, email } = style;

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  const searchParams = useSearchParams();

  const successCallback = searchParams.get("success");

  console.log(successCallback);

  useEffect(() => {
    if (successCallback) {
      console.log("useeffect");
      // updateInventory
      localStorage.clear();
      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      runFireworks();
    }
  }, [successCallback]);

  return success ? (
    <div className={successWrapper}>
      <div className={success}>
        <BsBagCheckFill className={icon} />

        <h2>Merci pour votre commande !</h2>
        <p className={emailMsg}>Un email de confirmation vous a été expédié.</p>
        <p className={description}>
          Pour toute question, n'hésitez pas à nous écrire à cette adresse :{" "}
          <a href={`mailto:${process.env.CONTACT_ORDERS}`} className={email}>
            {process.env.CONTACT_ORDERS}
          </a>
        </p>
        <Link href="/">
          <button type="btn" width="300px" className="btn">
            Continuer mes achats
          </button>
        </Link>
      </div>
    </div>
  ) : (
    <p>Il n'y a rien à voir ici.</p>
  );
};

export default Success;
