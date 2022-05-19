import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
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
    file: yup
      .mixed()
      .required("You need to provide a image file")
      .test("fileSize", "The file size is too large", (value) => {
        return value && value[0].size <= 3000000;
      })
      .test("type", "we only support image", (value) => {
        // console.log(typeof value);
        // console.log(value[0]);
        // console.log(value[0].type.includes("image"));
        return value && value[0].type.includes("image");
      }),
    category: yup.string().required("category is required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();
    const { title, description, file, category } = data;

    const token = Cookies.get("jwt");

    const userId = localStorage.getItem("userId");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("file", file[0]);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("userId", userId);

    axios
      .post("http://localhost:4000/api/v1/blogsfile/createfileblog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        const { status } = data.data;
        alert(status);
        props.onConfirm(!props.isOpen);
        history.replace("/");
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
          <label htmlFor="image">
            Image(Please upload file type of image and size less than 3MB)
          </label>
          <input
            type="file"
            id="image"
            name="file"
            {...register("file", { required: true })}
          />
          <p className={classes.error}>{errors.file?.message}</p>
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
        <ModalOverlay onConfirm={props.onConfirm} isOpen={props.isOpen} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default AddBlogModal;
