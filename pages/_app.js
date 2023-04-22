import "@/styles/globals.css";
import Layout from "../components/Layout";
import { StateContext } from "@/context/StateContext";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </SessionProvider>
  );
}
