import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <p>
        {new Date().getFullYear()} Artefacts e-commerce. Tous droits réservés.
      </p>
      <ul className="icons">
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
      </ul>
    </div>
  );
};

export default Footer;
