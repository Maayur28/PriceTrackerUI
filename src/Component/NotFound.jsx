import React from "react";
import { Result } from "antd";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Result
      status="404"
      title="Not Found!!!"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Link to="/">Back Home</Link>}
    />
  );
};

export default NotFound;
