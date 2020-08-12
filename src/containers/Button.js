import React from "react";
import { connect } from "react-redux";

import { getPosts } from "../actions";

const Button = ({ getPosts }) => {
  return <button onClick={getPosts}>Press to see post</button>;
};

const mapDispatchToProps = {
  getPosts,
};

export default connect(null, mapDispatchToProps)(Button);
