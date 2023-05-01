import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Steps, Alert, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearLogout, setLoginCookies } from "../../Cache";
const { Option } = Select;
const { Step } = Steps;

const Register = () => {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [otp, setotp] = useState("");
  useEffect(() => {
    if (
      Cookies.get("accessToken") !== undefined &&
      Cookies.get("refreshToken") !== undefined
    )
      navigate("/");
    else {
      clearLogout();
    }
  }, [navigate]);

  const onFinish = (values) => {
    setIsSubmitting(true);
    setError("");
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/register", {
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
        Cookies.remove("sessionId");
        Cookies.set("sessionId", data.authToken, { expires: 7, path: "" });
        setCurrent(1);
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(err.message);
      });
  };
  const verifyOtp = () => {
    let obj = {};
    obj.sessionId = Cookies.get("sessionId");
    obj.otp = otp;
    fetch("https://seahorse-app-xmw4g.ondigitalocean.app/verifyotp", {
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
        if (data.sessionId === false) setError("Invalid Otp!!!");
        else {
          Cookies.remove("sessionId");
          setLoginCookies({
            accessToken: data.accessToken,
            refreshToken: data.jwtRefreshToken,
            profileName: data.name,
            profileImage: data.image,
          });
          message.success("Registered Successfully", 3);
          navigate("/trackers");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(err);
      });
  };
  const otpOnChange = (e) => {
    setError("");
    const { value } = e.target;
    const reg = /^\d+$/;
    if (!isNaN(value) && reg.test(value)) {
      setotp(value);
    }
  };
  const steps = [
    {
      title: "Register",
      content: (
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          autoComplete="on"
          style={{ marginTop: "40px" }}
        >
          <Form.Item
            name="name"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: "Please input your name!",
                whitespace: true,
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
            extra="We will never share your email."
          >
            <Input prefix={<MailOutlined />} placeholder="E-mail" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmpassword"
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
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="Select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="login_button">
              <Button
                style={{ backgroundColor: "#7F4574" }}
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                Send Otp
              </Button>
              <Link to="/login">Login!</Link>
            </div>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Verify Otp",
      content: (
        <div className="verifyOtp">
          <Input
            value={otp}
            onChange={otpOnChange}
            placeholder="Input otp"
            maxLength={6}
          />
          <div className="login_button">
            <Button
              style={{ marginTop: "10px", backgroundColor: "#7F4574" }}
              type="primary"
              onClick={verifyOtp}
              loading={isSubmitting}
            >
              Verify
            </Button>
            <Button
              style={{ marginTop: "10px" }}
              type="link"
              onClick={() => setotp("")}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="register">
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {error.length > 0 ? <Alert type="error" message={error} banner /> : null}
      <div className="steps-content">{steps[current].content}</div>
    </div>
  );
};

export default Register;
