import React, { useState } from "react";
import { Rate, Form, Input, Button, Row, Col, message } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const recaptchaRef = React.createRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaverified, setcaptchaverified] = useState(false);
  const onFinish = async () => {
    setIsSubmitting(true);
    let obj = form.getFieldsValue();
    const recaptchaValue = await recaptchaRef.current.getValue();
    obj.captcha = recaptchaValue;
    if (
      obj.email != null &&
      obj.name != null &&
      obj.message != null &&
      obj.rating != null &&
      recaptchaValue != null
    ) {
      fetch("https://price-tracker-auth.vercel.app/contact", {
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
          if (data.success) {
            message.success("Message sent!!! Thankyou for contacting", 5);
            navigate("/");
          } else {
            message.error(
              "Error occurred!!! Refresh the page and please try again",
              5
            );
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          message.error(
            "Error occurred!!! Refresh the page and please try again",
            5
          );
        });
    } else {
      setIsSubmitting(false);
      message.error("Please enter valid information", 5);
    }
  };
  return (
    <div>
      <Row>
        <Col
          xs={20}
          sm={16}
          md={12}
          lg={10}
          xl={8}
          style={{ marginLeft: "20px" }}
        >
          <Form
            form={form}
            name="contact_form"
            className="contact-form"
            autoComplete="on"
            style={{ marginTop: "40px" }}
          >
            <Form.Item
              name="name"
              tooltip="What do you want us to call you?"
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
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please provide suggestion/feedback!",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Please feel free to provide suggestion or feedback."
              />
            </Form.Item>
            <Form.Item
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please provide your valuable rating!",
                },
              ]}
            >
              <Rate />
            </Form.Item>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Lf5Hr0dAAAAALIuH2ZavQv0r9CVnmkJFYhNH2VE"
              onChange={() => setcaptchaverified(true)}
              onExpired={() => recaptchaRef.reset()}
            />
            <Form.Item>
              <Button
                style={{ marginTop: "10px" }}
                type="primary"
                htmlType="submit"
                disabled={!captchaverified}
                loading={isSubmitting}
                onClick={onFinish}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
