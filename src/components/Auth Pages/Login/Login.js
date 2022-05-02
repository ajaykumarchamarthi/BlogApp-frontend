import React, { useContext } from "react";
import AuthContext from "../../../store/auth-context";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classes from "./Login.module.css";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6, "Password must be atleast 8 Characters long!"),
});

function Login() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    const email = data.email;
    const password = data.password;

    fetch("https://insta-blogapp.herokuapp.com/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert(data.status);
        authCtx.login(data.token);
        localStorage.setItem("userId", data.data.user._id);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <p className={classes.testCredential}>
          Test Credentials: ajayaj0302@gmail.com & ajay1234
        </p>
        <div className={classes.title}>
          <h3>Login</h3>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            {...register("email", { required: true })}
          />
          <p className={classes.error}>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            {...register("password", { required: true })}
          />
          <p className={classes.error}>{errors.password?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Login</button>
        </div>
        <div className={classes.options}>
          <p>
            <span onClick={() => history.push("/signup")}>Click here</span> to
            Register
          </p>
        </div>
        <hr />
        <div className={classes.options}>
          <p className={classes.optionsHeading}>Forgot Password?</p>
          <p className={classes.optionsText}>
            <span onClick={() => history.push("/forgotPassword")}>
              Click here
            </span>{" "}
            to reset your password
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
