import React from "react";
import { connect } from "react-redux";

const postItem = {
  width: "50%",
  margin: "0 auto",
  color: "olive",
};

let PostItem = ({ post }) => {
  return post ? (
    <div style={postItem}>
      <h3>UserId: {post.userId}</h3>
      <h4>Title: {post.title}</h4>
      <p>Completed: {post.completed ? "True" : "False"} </p>
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  post: state.post,
});

PostItem = connect(mapStateToProps, null)(PostItem);
export default PostItem;
