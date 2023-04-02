import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./login.css";

const Login = () => {
  let navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    )
      navigate("/");
    else {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  }, [navigate]);

  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://price-tracker-auth.vercel.app/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        setIsSubmitting(false);
        Cookies.set("accessToken", data.accessToken, {
          expires: 7,
          path: "",
        });
        Cookies.set("refreshToken", data.jwtRefreshToken, {
          expires: 7,
          path: "",
        });
        Cookies.set("profileName", data.name, {
          expires: 7,
          path: "",
        });
        Cookies.set("profileImage", data.image, {
          expires: 7,
          path: "",
        });
        message.success("Login Successful", 5);
        navigate("/");
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error("Invalid Credentials!!!", 5);
      });
  };
  return (
    <div className="login">
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        autoComplete="on"
        onFinish={onFinish}
        style={{ marginTop: "40px" }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            { type: "email", warningOnly: true },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Link className="login-form-forgot" to="/forgetpassword">
            Forgot password?
          </Link>
        </Form.Item>

        <Form.Item>
          <div className="login_button">
            <Button
              style={{ backgroundColor: "#7F4574" }}
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              Login
            </Button>
            <Link to="/register">Register now!</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
