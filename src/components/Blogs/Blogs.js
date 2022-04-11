import React, { useEffect, useState } from "react";
import BlogsList from "./BlogsList";
import axios from "axios";
import "./Blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      const response = await axios.get(
        "https://insta-blogapp.herokuapp.com/api/v1/blogs/allblogs"
      );
      const { data } = response.data;
      console.log(data.blogs);
      setBlogs(data.blogs);
    };

    loadBlogs();
  }, []);

  let blogsData;

  if (blogs.length > 0) {
    blogsData = blogs.map((blog) => (
      <BlogsList
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

  return <div className="blogs">{blogsData}</div>;
}

export default Blogs;
