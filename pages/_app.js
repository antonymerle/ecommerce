import "@/styles/globals.css";
import Layout from "../components/Layout";
import { stateContext } from "@/context/StateContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <stateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </stateContext>
  );
}
