import React from "react";
import Link from "next/link";
import { BiMessageSquareError } from "react-icons/bi";
import style from "../styles/Unauthorized.module.css";

const { icon, container, btn } = style;

const Unauthorized = () => {
  return (
    <div className={container}>
      <BiMessageSquareError className={icon} />
      <p>
        Erreur : vous devez vous authentifier pour accéder à cette ressource.
      </p>
      <Link href="/">
        <button type="button" className={btn}>
          Revenir à l'accueil.
        </button>
      </Link>
    </div>
  );
};

export default Unauthorized;
