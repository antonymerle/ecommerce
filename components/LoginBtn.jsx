import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const LoginBtn = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      <p>Not signed in </p>

      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

export default LoginBtn;
