import React, { useState, useEffect, useContext } from "react";
import UserBlogsList from "./userblog/UserBlogsList";
import AuthContext from "../../store/auth-context";
import classes from "./BlogProfile.module.css";
import axios from "axios";

function BlogProfile(props) {
  const [blogs, setBlogs] = useState([]);

  const editSubmitCtx = useContext(AuthContext);

  const addSubmitCtx = useContext(AuthContext);

  const onEditRerender = editSubmitCtx.isEditSubmitted;

  const onAddRerender = addSubmitCtx.isAddSubmitted;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadBlogs = async () => {
      console.log("Rerender triggered");
      const response = await axios.get(
        "https://insta-blogapp.herokuapp.com/api/v1/blogs/allblogs"
      );
      const { data } = response.data;
      setBlogs(data.blogs);
      props.onSaveUserData(
        data.blogs.filter((blog) => blog.user._id === userId)
      );
    };

    loadBlogs();
    // eslint-disable-next-line
  }, [onAddRerender, onEditRerender]);

  let filteredBlogData;

  if (blogs.length > 0) {
    filteredBlogData = blogs
      .filter((blog) => blog.user._id === userId)
      .map((blog) => (
        <UserBlogsList
          key={blog._id}
          id={blog._id}
          title={blog.title}
          picture={blog.picture}
          createdAt={blog.createdAt}
          description={blog.description}
          category={blog.category}
          likes={blog.likes}
          user={blog.user}
        />
      ));
  }

  return <div className={classes.container}>{filteredBlogData}</div>;
}

export default React.memo(BlogProfile);
