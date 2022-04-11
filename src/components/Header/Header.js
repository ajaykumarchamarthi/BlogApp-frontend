import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Web from "./Web/Web";
import Mobile from "./Mobile/Mobile";
import { GiHamburgerMenu } from "react-icons/gi";

import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const history = useHistory();

  return (
    <div className="header">
      <h3 className="logo" onClick={() => history.replace("/")}>
        Insta Blog
      </h3>
      <div className="menu">
        <div className="web-menu">
          <Web />
        </div>
        <div className="mobile-menu">
          <div onClick={() => setIsOpen(!isOpen)}>
            <GiHamburgerMenu size={24} />
          </div>
          {isOpen && <Mobile isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
      </div>
    </div>
  );
}

export default Header;
