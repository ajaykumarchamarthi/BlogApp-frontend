import React, { useState, useContext } from "react";
import AuthContext from "../../../store/auth-context";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import EditBlogModal from "../../Modal/EditBlogModal/EditBlogModal";
import classes from "./UserBlogsList.module.css";

function UserBlogsList({
  id,
  picture,
  title,
  category,
  description,
  createdAt,
  user,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isEditSubmittedCtx = useContext(AuthContext);

  const time = Date.parse(createdAt);
  const date = new Date(time);

  const token = Cookies.get("jwt");

  const history = useHistory();

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  const deleteHandler = (blogId) => {
    fetch("https://insta-blogapp.herokuapp.com/api/v1/blogs/deleteblog", {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ blogId }),
    })
      .then((data) => {
        isEditSubmittedCtx.toggleEditSubmitHandler();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <>
      <div className={classes.card}>
        <div className={classes.picture}>
          <img src={picture} alt="blog pic" />
        </div>
        <div className={classes.info}>
          <div className={classes.creation}>
            <p>Created By - {user.userName}</p>
            <p>
              Created At -
              {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
            </p>
          </div>
          <h3
            onClick={() => history.replace(`/blogs/${id}`)}
            className={classes.navigate}
          >
            {title}
          </h3>
          <div className={classes.options}>
            <div>
              <button onClick={openHandler}>Edit Blog</button>
              {isOpen && (
                <EditBlogModal
                  onConfirm={openHandler}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  blogId={id}
                  title={title}
                  picture={picture}
                  category={category}
                  description={description}
                />
              )}
            </div>
            <div>
              <button onClick={() => deleteHandler(id)}>Delete Blog</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserBlogsList;
