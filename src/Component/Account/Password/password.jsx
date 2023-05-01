import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./password.css";
import { clearLogout } from "../../../Cache";

const Password = () => {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/verifyaccess", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
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
        if (data.accessToken !== false) {
          Cookies.set("accessToken", data.accessToken, {
            expires: 7,
            path: "",
          });
          fetch(
            `https://seahorse-app-xmw4g.ondigitalocean.app/changepassword/${data.userid}`,
            {
              method: "POST",
              body: JSON.stringify(values),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          )
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((val) => {
              setIsSubmitting(false);
              if (val.status) {
                message.success("Password Updated!!!", 3);
                clearLogout();
                navigate("/login");
              } else {
                message.error("Invalid Password!!!", 3);
              }
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.error("Please login to view account", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        autoComplete="on"
        style={{ marginTop: "40px" }}
      >
        <Form.Item
          label="Current Password"
          name="currentpassword"
          rules={[
            {
              required: true,
              message: "Please input your current password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Current Password"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please input your new password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item
          name="confirmpassword"
          label="Confirm New Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm New Password"
          />
        </Form.Item>
        <Form.Item extra="Once the password is changed you need to login again.">
          <Button
            style={{ backgroundColor: "#7F4574" }}
            block
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Password;
