import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./BlogsList.module.css";

function BlogsList({
  id,
  picture,
  title,
  category,
  description,
  likes,
  createdAt,
  user,
}) {
  const history = useHistory();

  const time = Date.parse(createdAt);
  const date = new Date(time);

  return (
    <>
      <div
        className={classes.card}
        onClick={() => history.push("/blogs/" + id)}
      >
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
          <h3>{title}</h3>
          <p className={classes.category}>{category}</p>
          <div className={classes.description}>
            <p>{description.slice(0, 200)}.....</p>
            <div className={classes.readMoreContainer}>
              <span
                onClick={() => history.push("/blogs/" + id)}
                className={classes.readMore}
              >
                Read More
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogsList;
