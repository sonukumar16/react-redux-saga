import React from 'react';
import Button from "../containers/Button";
import PostItem from "../containers/PostItem";
import Loading from "../containers/Loading";

const App = () => (
  <div>
    <Button />
    <Loading />
    <PostItem />
  </div>
);

export default App;
