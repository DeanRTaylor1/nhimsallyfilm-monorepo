import React from "react";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineYoutube,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div className="flex justify-between items-center md:w-3/4 max-w-[1400px] p-4">
      <div>NhimSally.Film © 2019</div>
      <div className="flex gap-2 items-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/nhimsally.film/?hl=en"
        >
          <AiOutlineInstagram className="smIcons" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/nhimchupfilm/"
        >
          <AiOutlineFacebook className="smIcons" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/c/NhimChupFilm?app=desktop"
        >
          {" "}
          <AiOutlineYoutube className="smIcons text-2xl" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
