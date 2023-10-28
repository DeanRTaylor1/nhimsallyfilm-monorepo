   import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react"; 
import { IconContext } from "react-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { navList } from "./DashBoardNav";


const MobileDashBoardNav: React.FC = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    await signOut();
    router.replace("/");
  };

  const [navBarStyle, setNavBarSyle] = useState<string>(
    "navbarDropdownList scale-0"
  );
  const [hamburgerStyle, setHamburgerStyle] = useState("hamburger");

  const navBarHandler = () => {
    setNavBarSyle(
      navBarStyle === "navbarDropdownList scale-0"
        ? "navbarDropdownList scale-100"
        : "navbarDropdownList scale-0"
    );
    hamburgerHandler();
  };

  const hamburgerHandler = () => {
    setHamburgerStyle(
      hamburgerStyle === "hamburger" ? "hamburger rotate-90" : "hamburger"
    );
  };

  return (
  <Fragment>
  <div className="absolute top-4 right-8 z-10">
        <div onClick={navBarHandler} className="group">
          <IconContext.Provider
            value={{
              color: "rgb(24 24 27)",
              className: "global-class-name 0",
            }}
          >
            <GiHamburgerMenu className={hamburgerStyle} />
          </IconContext.Provider>
          <div className={navBarStyle}>
            <ul className="flex flex-col gap-4 pt-12">{navList}</ul>
          </div>
        </div>
      </div>
  </Fragment>
  )

}
export default MobileDashBoardNav
