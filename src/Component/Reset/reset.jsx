import React, { useState, useEffect } from "react";
import { Form, Input, message, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";

const Reset = () => {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const { token } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let obj = {};
    obj.token = token;
    setIsSubmitting(true);
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/reset", {
      method: "POST",
      body: JSON.stringify(obj),
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
        if (!data.status) {
          message.error("Token expired!!!", 5);
          navigate("/forgetpassword", { replace: true });
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error("Token expired!!!", 5);
        navigate("/forgetpassword", { replace: true });
      });
  }, [navigate, token]);

  const onFinish = (values) => {
    values.token = token;
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/reset", {
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
        if (data.status) {
          message.success("Reset Successful", 3);
          navigate("/login", { replace: true });
        } else {
          message.error("Token expired!!!", 5);
          navigate("/forgetpassword", { replace: true });
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error("Token expired!!!", 5);
        navigate("/forgetpassword", { replace: true });
      });
  };
  return (
    <div className="login">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        autoComplete="on"
        style={{ marginTop: "40px" }}
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmpassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
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
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ backgroundColor: "#7F4574" }}
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Reset;
