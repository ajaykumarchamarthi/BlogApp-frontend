import React, { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink, Link } from "react-router-dom";
import classes from "./Mobile.module.css";
import AuthContext from "./../../../store/auth-context";

function Mobile({ isOpen, setIsOpen }) {
  const authCtx = useContext(AuthContext);
  return (
    <div className={classes.mobile}>
      <div onClick={() => setIsOpen(!isOpen)} className={classes.closeicon}>
        <AiOutlineClose size={24} />
      </div>
      <div className={classes.mobileoption}>
        <ul className={classes.mobileoptions}>
          <li>
            <NavLink
              to="/"
              activeClassName={classes.active}
              onClick={() => setIsOpen(!isOpen)}
            >
              Blogs
            </NavLink>
          </li>
          {authCtx.isLoggedIn && (
            <li>
              <NavLink
                to="/profile"
                activeClassName={classes.active}
                onClick={() => setIsOpen(!isOpen)}
              >
                Profile
              </NavLink>
            </li>
          )}
          {!authCtx.isLoggedIn && (
            <li>
              <Link to="/login" onClick={() => setIsOpen(!isOpen)}>
                <span className={classes.btn}>Login</span>
              </Link>
            </li>
          )}
          {authCtx.isLoggedIn && (
            <li>
              <span className={classes.btn} onClick={() => authCtx.logout()}>
                Logout
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Mobile;
