import style from "../styles/UserModal.module.css";
import { signIn, signOut } from "next-auth/react";

import { useStateContext } from "@/context/StateContext";

const { userModal, connectbtn } = style;

const UserModal = () => {
  const { userSession } = useStateContext();
  const firstName =
    userSession?.session?.user?.given_name?.split(" ")[0] ?? "utilisateur";

  return (
    <div className={userModal}>
      <button
        type="button"
        onClick={userSession ? signOut : signIn}
        className={connectbtn}
      >
        {userSession ? `Bienvenue, ${firstName}` : "Se connecter"}
      </button>
    </div>
  );
};

export default UserModal;
