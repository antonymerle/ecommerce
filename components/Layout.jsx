import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";
import style from "../styles/Layout.module.css";

const { mainContainer, layout } = style;

const Layout = ({ children }) => {
  return (
    <div className={layout}>
      <Head>
        <title>JoliShop e-commerce</title>
        <meta
          name="description"
          content="Modèle de boutique ecommerce. Réalisation sur mesure par Antony Merle, développeur web à Anglet, France"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Navbar />

      <main className={mainContainer}>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
