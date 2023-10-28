import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconContext } from "react-icons";
import Link from "next/link";

const navItems = [
  { name: "Home", href: "/", target: "_self" },
  { name: "Galleries", href: "/gallery", target: "_self" },
  { name: "Packages", href: "/package", target: "_self" },
  { name: "Make A Booking", href: "https://ig.me/m/nhimsally.film", target: "_blank" },
  { name: "Contact", href: "/contact", target: "_self" },
];


const Navbar: React.FC = () => {
  const [navBarStyle, setNavBarSyle] = useState<string>(
    "navbarDropdownList scale-0 opacity-0"
  );
  const [hamburgerStyle, setHamburgerStyle] = useState("hamburger");

  const navBarHandler = () => {
    setNavBarSyle(
      navBarStyle === "navbarDropdownList scale-0 opacity-0"
        ? "navbarDropdownList scale-100 opacity-100"
        : "navbarDropdownList scale-0 opacity-0"
    );
    hamburgerHandler();
    setTimeout(() => {
      const listItems = document.getElementsByClassName("navbarDropdownListItem");
      for (let i = 0; i < listItems.length; i++) {
        (listItems[i] as HTMLElement).style.opacity = navBarStyle === "navbarDropdownList scale-0 opacity-0" ? "100" : "0";
      }
    }, 100);

  };


  const hamburgerHandler = () => {
    setHamburgerStyle(
      hamburgerStyle === "hamburger" ? "hamburger rotate-180" : "hamburger"
    );
  };

  return (
    <div className="flex justify-between items-center p-2 md:w-full lg:w-3/4 max-w-[1400px]">
      <Link href="/">
        <h1 className="tracking-widest text-2xl font-extrabold  relative z-50 hover:cursor-pointer">
          NhimSally
        </h1>
      </Link>

      {/* Mobile Nav */}
      <div onClick={navBarHandler} className="lg:hidden group z-40">
        <IconContext.Provider
          value={{
            color: "rgb(24 24 27)",
            className: "global-class-name 0",
          }}
        >
          <GiHamburgerMenu className={hamburgerStyle} />
        </IconContext.Provider>
        <div className={navBarStyle}>
          <ul className="flex flex-col gap-4 pt-12">
            {navItems.map((item) => (
              <Link href={item.href} key={item.name} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} className="navbarDropdownListItem">
                {item.name}

              </Link>
            ))}
          </ul>
        </div>
      </div>
      {/* Tablet and desktop Nav */}
      <div className="hidden md:flex">
        <ul className="flex gap-4 ">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} className="navbarDropdownListItem">
              {item.name}

            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
