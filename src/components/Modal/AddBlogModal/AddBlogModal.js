import React from "react";
import { useHistory } from "react-router-dom";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import classes from "./AddBlogModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  const history = useHistory();

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Describtion is required"),
    picture: yup.string().required("Image is required"),
    category: yup.string().required("category is required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const { title, description, picture, category } = data;

    const token = Cookies.get("jwt");

    const userId = localStorage.getItem("userId");

    fetch("https://insta-blogapp.herokuapp.com/api/v1/blogs/createblog", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, picture, category, description, userId }),
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
        history.replace("/profile");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={classes.modal}>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            {...register("title", { required: true })}
          />
          <p className={classes.error}>{errors.title?.message}</p>
        </div>
        <div>
          <label htmlFor="image">Image(Please use url)</label>
          <input
            type="text"
            id="image"
            name="picture"
            {...register("picture", { required: true })}
          />
          <p className={classes.error}>{errors.picture?.message}</p>
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            {...register("category", { required: true })}
          >
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Nature">Nature</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Other">Other</option>
          </select>
          <p className={classes.error}>{errors.category?.message}</p>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            rows="10"
            cols="50"
            id="description"
            name="description"
            {...register("description", { required: true })}
          />
          <p className={classes.error}>{errors.description?.message}</p>
        </div>
        <div className={classes.btn}>
          <button type="submit">Post Blog</button>
        </div>
      </form>
    </div>
  );
};

function AddBlogModal(props) {
  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay onConfirm={props.onConfirm} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default AddBlogModal;
