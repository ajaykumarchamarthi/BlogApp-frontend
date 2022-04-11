import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import AuthContext from "../../../store/auth-context";
import classes from "./Web.module.css";

function Web() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  return (
    <div className={classes.web}>
      <ul className={classes.weboption}>
        <li>
          <NavLink to="/" activeClassName={classes.active}>
            Blogs
          </NavLink>
        </li>
        {authCtx.isLoggedIn && (
          <li>
            <NavLink to="/profile" activeClassName={classes.active}>
              Profile
            </NavLink>
          </li>
        )}
        {!authCtx.isLoggedIn && (
          <li>
            <span
              className={classes.btn}
              onClick={() => history.replace("/login")}
            >
              Login
            </span>
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
  );
}

export default Web;
