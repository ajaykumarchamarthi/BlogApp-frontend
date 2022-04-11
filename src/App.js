import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Blogs from "./components/Blogs/Blogs";
import BlogDetails from "./components/Blogs/BlogDetails";
import Signup from "./components/Auth Pages/Signup/Signup";
import Login from "./components/Auth Pages/Login/Login";
import ForgotPassword from "./components/Auth Pages/Forgot Password/ForgotPassword";
import ResetPassword from "./components/Auth Pages/Reset Password/ResetPassword";
import Profile from "./components/Profile/Profile";
import AuthContext from "./store/auth-context";
import { AuthContextProvider } from "./store/auth-context";

import "./App.css";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <AuthContextProvider>
      <Header />
      <div className="container">
        <div className="wrapper">
          <Switch>
            <Route path="/" exact>
              <Blogs />
            </Route>
            <Route path="/blogs/:blogId">
              <BlogDetails />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/login">
              {!authCtx.isLoggedIn ? <Login /> : <Redirect to="/" />}
            </Route>
            <Route path="/signup">
              {!authCtx.isLoggedIn ? <Signup /> : <Redirect to="/" />}
            </Route>
            {!authCtx.isLoggedIn && (
              <Route path="/forgotpassword">
                <ForgotPassword />
              </Route>
            )}
            {!authCtx.isLoggedIn && (
              <Route path="/resetpassword/:token" exact>
                <ResetPassword />
              </Route>
            )}

            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </div>
      <Footer />
    </AuthContextProvider>
  );
}

export default App;
