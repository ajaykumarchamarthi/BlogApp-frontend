import React from "react";
import User from "./User";
import BlogProfile from "./BlogProfile";
import classes from "./Profile.module.css";

function Profile() {
  const onSaveUser = (data) => {
    // console.log(data);
  };

  return (
    <div>
      <div className={classes.profile}>
        <User />
      </div>
      <div className={classes.blogProfile}>
        <BlogProfile onSaveUserData={onSaveUser} />
      </div>
    </div>
  );
}

export default Profile;
