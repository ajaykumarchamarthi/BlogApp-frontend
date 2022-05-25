import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import classes from "./BlogDetails.module.css";
import { MdOutlineFavorite } from "react-icons/md";
import { MdOutlineFavoriteBorder } from "react-icons/md";

function BlogDetails() {
  const [blogs, setBlogs] = useState([]);
  const [like, setLike] = useState(undefined);
  const authCtx = useContext(AuthContext);

  const token = Cookies.get("jwt");

  const params = useParams();
  const id = params.blogId;

  useEffect(() => {
    const loadBlogs = async () => {
      const response = await axios.get(
        "https://insta-blogapp.herokuapp.com/api/v1/blogs/allblogs"
      );
      const { data } = response.data;
      setBlogs(data.blogs);
    };

    loadBlogs();
  }, [like]);

  const userId = localStorage.getItem("userId");

  const blogDetail = blogs.filter((blog) => blog._id === id);

  const likePost = (blogId, userId) => {
    authCtx.isLoggedIn
      ? fetch("https://insta-blogapp.herokuapp.com/api/v1/blogs/like", {
          method: "PATCH",
          body: JSON.stringify({ blogId, userId }),
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            setLike(true);
          })
          .catch((err) => alert(err.message))
      : alert("Please Log In");
  };

  const unlikePost = (blogId, userId) => {
    fetch("https://insta-blogapp.herokuapp.com/api/v1/blogs/unlike", {
      method: "PATCH",
      body: JSON.stringify({ blogId, userId }),
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        setLike(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={classes.layout}>
      {blogDetail.map((blog) => (
        <div className={classes.blogDetailContainer} key={blog._id}>
          <div className={classes.blogDetailPicture}>
            <img src={blog.picture} alt="blog pic" />
          </div>
          <div className={classes.blogDetailInfo}>
            <p>Posted By - {blog.user.userName}</p>
          </div>
          <div className={classes.blogDetailTitle}>
            <h3>{blog.title}</h3>
          </div>
          <div className={classes.blogDetailDescription}>
            <p className={classes.description}>{blog.description}</p>
          </div>
          <div className={classes.likes}>
            <div className={classes.like}>
              {blog.likes.find((user) => user._id === userId) ? (
                <MdOutlineFavorite
                  color="red"
                  size={48}
                  onClick={() => unlikePost(blog._id, userId)}
                />
              ) : (
                <MdOutlineFavoriteBorder
                  size={48}
                  onClick={() => likePost(blog._id, userId)}
                />
              )}
            </div>
            <p className={classes.likeCount}>{blog.likes.length} Likes</p>
          </div>
          {authCtx.isLoggedIn}
        </div>
      ))}
    </div>
  );
}

export default BlogDetails;
