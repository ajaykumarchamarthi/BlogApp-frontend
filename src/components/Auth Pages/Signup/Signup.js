import React, { useContext } from "react";
import AuthContext from "../../../store/auth-context";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./Signup.module.css";

const schema = yup.object().shape({
  userName: yup
    .string()
    .min(6, "Username must atleast be 6 Characters long!")
    .required("User name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(8, "Password must atleast be 8 Characters long!"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

function Signup() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    console.log(data);

    const userName = data.userName;
    const email = data.email;
    const password = data.password;
    const passwordConfirm = data.passwordConfirm;

    fetch("https://insta-blogapp.herokuapp.com/api/v1/users/signup", {
      method: "POST",
      body: JSON.stringify({ userName, email, password, passwordConfirm }),
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            const errorMessage = `${data.message}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.token);
        localStorage.setItem("userId", data.data.user._id);
        history.replace("/");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <div className={classes.title}>
          <h3>Sign Up</h3>
        </div>
        <div>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            name="userName"
            id="userName"
            {...register("userName", {
              required: true,
            })}
          />
          <p className={classes.error}>{errors.userName?.message}</p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            {...register("password", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            {...register("passwordConfirm", {
              required: true,
            })}
          />
          <p className={classes.error}> {errors.passwordConfirm?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">SignUp</button>
        </div>
        <div className={classes.options}>
          <p>
            <span onClick={() => history.push("/login")}>Click here</span> to
            Login
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
