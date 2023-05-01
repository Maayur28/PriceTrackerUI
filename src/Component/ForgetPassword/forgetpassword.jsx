import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./forgetpassword.css";

const ForgetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setresetStatus] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/forgetpassword", {
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
        if (data.status === true) setresetStatus(true);
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };
  return (
    <div className="login">
      {resetStatus ? (
        <Alert
          message="Success"
          description="Reset link has been sent to your email"
          type="success"
          showIcon
        />
      ) : (
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
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ backgroundColor: "#7F4574" }}
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              Get Reset Link
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
export default ForgetPassword;
