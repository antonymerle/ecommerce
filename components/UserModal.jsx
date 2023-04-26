import style from "../styles/UserModal.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

const { userModal, connectbtn } = style;

const UserModal = () => {
  const { data: session } = useSession();
  // console.log(session);
  const firstName = session?.user?.name?.split(" ")[0] ?? "utilisateur";

  return (
    <div className={userModal}>
      <button
        type="button"
        onClick={session ? signOut : signIn}
        className={connectbtn}
      >
        {session ? `Bienvenue, ${firstName}` : "Se connecter"}
      </button>
    </div>
  );
};

export default UserModal;
