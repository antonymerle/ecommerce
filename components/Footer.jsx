import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiOutlineLink,
} from "react-icons/ai";
import style from "../styles/Footer.module.css";

const { footerContainer, icons } = style;

const Footer = () => {
  return (
    <div className={footerContainer}>
      <p>
        {new Date().getFullYear()} JoliShop e-commerce, Antony Merle . Site de
        démonstration, les produits présentés sont fictifs.
      </p>
      <ul className={icons}>
        <li>
          <a
            href="https://www.instagram.com/antonymerle"
            target="blank"
            rel="noopener noreferrer"
            aria-label="Antony Merle's Instagram profile"
          >
            <div>
              <AiFillInstagram />
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/AntonyMerleDev"
            target="blank"
            rel="noopener noreferrer"
            aria-label="Antony Merle's Twitter profile"
          >
            <div>
              <AiOutlineTwitter />
            </div>
          </a>
        </li>
        <li>
          <a
            href="http://antonymerle.dev/"
            target="blank"
            rel="noopener noreferrer"
            aria-label="Antony Merle's portfolio website"
          >
            <div>
              <AiOutlineLink />
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
