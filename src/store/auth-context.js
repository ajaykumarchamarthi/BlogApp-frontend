import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  isAddSubmitted: false,
  isEditSubmitted: false,
  toggleAddSubmitHandler: () => {},
  toggleEditSubmitHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const history = useHistory();
  const cookies = Cookies.get("jwt");
  const userIsLoggedIn = !!cookies;

  const [token, setToken] = useState(cookies);

  const [isAddSubmitted, setIsAddSubmitted] = useState(false);

  const [isEditSubmitted, setIsEditSubmitted] = useState(false);

  const logoutHandler = () => {
    Cookies.remove("jwt");
    setToken(null);
    localStorage.removeItem("userId");
    history.replace("/");
  };

  const loginHandler = (token) => {
    Cookies.set("jwt", token, { expires: 7, path: "/" });
    setToken(token);
  };

  const toggleAddSubmitHandler = () => {
    setIsAddSubmitted(!isAddSubmitted);
  };

  const toggleEditSubmitHandler = () => {
    setIsEditSubmitted(!isEditSubmitted);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    isAddSubmitted: isAddSubmitted,
    toggleAddSubmitHandler: toggleAddSubmitHandler,
    isEditSubmitted: isEditSubmitted,
    toggleEditSubmitHandler: toggleEditSubmitHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
