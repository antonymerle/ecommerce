import style from "../styles/UserModal.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

const { userModal, connectbtn } = style;

const UserModal = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className={userModal}>
      <button
        type="button"
        onClick={session ? signOut : signIn}
        className={connectbtn}
      >
        {session
          ? `Bienvenue, ${session.user.name.split(" ")[0]}`
          : "Se connecter"}
      </button>
    </div>
  );
};

export default UserModal;
