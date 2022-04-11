import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import ReactDom from "react-dom";
import Cookies from "js-cookie";
import classes from "./EditBlogModal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = ({ blogId, title, picture, category, description }) => {
  const history = useHistory();

  const titleInputRef = useRef("");
  const pictureInputRef = useRef("");
  const categoryInputRef = useRef("");
  const descriptionInputRef = useRef("");

  const token = Cookies.get("jwt");

  const submitHandler = (event) => {
    event.preventDefault();

    const title = titleInputRef.current.value;
    const picture = pictureInputRef.current.value;
    const category = categoryInputRef.current.value;
    const description = descriptionInputRef.current.value;

    fetch("https://insta-blogapp.herokuapp.com/api/v1/blogs/editblog", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        blogId: blogId,
        update: {
          title: title,
          picture: picture,
          category: category,
          description: description,
        },
      }),
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
    <div className={classes.modal} onSubmit={submitHandler}>
      <form className={classes.form}>
        <div>
          <label>Title</label>
          <input type="text" defaultValue={title} ref={titleInputRef} />
        </div>
        <div>
          <label>Image(Please use url)</label>
          <input type="text" defaultValue={picture} ref={pictureInputRef} />
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
