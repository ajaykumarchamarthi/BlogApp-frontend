import React, { useState, useEffect } from "react";
import AddBlogModal from "../Modal/AddBlogModal/AddBlogModal";
import axios from "axios";
import classes from "./User.module.css";

function User() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get(
        "https://insta-blogapp.herokuapp.com/api/v1/users"
      );
      const { data } = response.data;
      setUser(data.users.find((user) => user._id === userId));
    };
    loadUsers();
  }, [userId]);

  const openHandler = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={classes.userProfile}>
        <div className={classes.profileContainer}>
          <div className={classes.profileDetails}>
            <h3>{user.userName}</h3>
            <p>{user.email}</p>
          </div>
          <div className={classes.addBlog}>
            <button onClick={openHandler}>Add Blog</button>
            {isOpen && <AddBlogModal onConfirm={openHandler} isOpen={isOpen} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(User);
