import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";
import classes from "./EditBlogModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  file: yup
    .mixed()
    .required("You need to provide a image file")
    .test("fileSize", "The file size is too large", (value) => {
      return value && value[0].size <= 3000000;
    })
    .test("type", "we only support image", (value) => {
      console.log(typeof value);
      console.log(value[0]);
      console.log(value[0].type.includes("image"));
      return value && value[0].type.includes("image");
    }),
});

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = ({
  blogId,
  title,
  category,
  description,
  onConfirm,
  isOpen,
}) => {
  const history = useHistory();

  const titleInputRef = useRef("");
  const categoryInputRef = useRef("");
  const descriptionInputRef = useRef("");

  const token = Cookies.get("jwt");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = (data, event) => {
    event.preventDefault();

    const userId = localStorage.getItem("userId");

    const title = titleInputRef.current.value;
    const category = categoryInputRef.current.value;
    const description = descriptionInputRef.current.value;
    const file = data.file;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("file", file[0]);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("blogId", blogId);
    formData.append("userId", userId);

    axios
      .patch("http://localhost:4000/api/v1/blogsfile/editfileblog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        const { status } = data.data;
        alert(status);

        onConfirm(!isOpen);
        history.replace("/");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={classes.modal} onSubmit={handleSubmit(submitHandler)}>
      <form className={classes.form}>
        <div>
          <label>Title</label>
          <input type="text" defaultValue={title} ref={titleInputRef} />
        </div>
        <div>
          <label htmlFor="image">
            Image(Please upload file type of image and size less than 3MB)
          </label>
          <input
            type="file"
            id="image"
            name="file"
            required
            {...register("file", { required: true })}
          />
          <p className={classes.error}>{errors.file?.message}</p>
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            defaultValue={category}
            ref={categoryInputRef}
          >
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Nature">Nature</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Description</label>
          <textarea
            rows="10"
            cols="50"
            defaultValue={description}
            ref={descriptionInputRef}
          />
        </div>
        <div className={classes.btn}>
          <button type={classes.submit}>Edit Blog</button>
        </div>
      </form>
    </div>
  );
};

function EditBlogModal(props) {
  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDom.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          isOpen={props.isOpen}
          blogId={props.blogId}
          title={props.title}
          description={props.description}
          category={props.category}
          picture={props.picture}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
}

export default React.memo(EditBlogModal);
