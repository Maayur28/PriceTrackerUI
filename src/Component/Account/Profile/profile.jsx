import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  Form,
  Input,
  message,
  Space,
  Skeleton,
  Upload,
  Modal,
} from "antd";
import ImgCrop from "antd-img-crop";
import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import "./profile.css";
import { clearLogout } from "../../../Cache";
import { validateLogin } from "../../../Util";

const { Option } = Select;
const Profile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [usernameVerified, setUserNameVerified] = useState(false);
  const [verifyCalled, setVerifyCalled] = useState(false);
  const [profile, setProfile] = useState({});
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [usernameChange, setusernameChange] = useState(false);

  const usernameChanged = (e) => {
    setUserNameVerified(false);
    if (e.target.value !== profile.username) {
      setVerifyCalled(false);
      setusernameChange(true);
    } else setusernameChange(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.preview);
    setPreviewOpen(true);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPEG/JPG//PNG file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
    }
    return isLt5M && isJpgOrPng;
  };
  const handleChange = (info) => {
    setFileList(info.fileList);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    validateLogin() ? navigate("/login") : fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = () => {
    setIsSubmitting(true);
    fetch("https://price-tracker-auth.vercel.app/verifyaccess", {
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
            `https://price-tracker-auth.vercel.app/getprofile/${data.userid}`
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
              setProfile(val.profile);
              if (
                val.profile.image != null &&
                val.profile.image !== undefined &&
                val.profile.image !== ""
              ) {
                let file = {};
                file.status = "done";
                file.url = val.profile.image;
                file.added = true;
                setFileList([file]);
              } else {
                setFileList([]);
              }
              setUserNameVerified(true);
              setusernameChange(false);
              form.setFieldsValue(val.profile);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(
                "Sorry!!! Server is busy. Please try again later",
                5
              );
            });
        } else {
          message.error("Please login to view account", 5);
          setIsSubmitting(false);
          clearLogout();
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error("Please login to view account", 5);
        clearLogout();
        navigate("/login");
      });
  };

  const onFinish = (values) => {
    if (usernameVerified) {
      setIsSubmitting(true);
      fetch("https://price-tracker-auth.vercel.app/verifyaccess", {
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
            if (
              fileList.length > 0 &&
              fileList[0].status !== undefined &&
              fileList[0].status === "done"
            ) {
              if (fileList[0].added === true) {
                values.image = fileList[0].url;
              } else {
                values.image = fileList[0].response.secure_url;
              }
            } else {
              values.image = "";
            }
            fetch(
              `https://price-tracker-auth.vercel.app/updateprofile/${data.userid}`,
              {
                method: "PUT",
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
                message.success("Profile Updated", 3);
                setProfile(val.profile);
                Cookies.set("profileName", val.profile.name, {
                  expires: 7,
                  path: "",
                });
                Cookies.set("profileImage", val.profile.image, {
                  expires: 7,
                  path: "",
                });
                if (
                  val.profile.image != null &&
                  val.profile.image !== undefined &&
                  val.profile.image !== ""
                ) {
                  let file = {};
                  file.status = "done";
                  file.url = val.profile.image;
                  file.added = true;
                  setFileList([file]);
                }
                setUserNameVerified(true);
                setusernameChange(false);
                setVerifyCalled(false);
                form.setFieldsValue(val.profile);
                window.location.reload();
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
    } else {
      message.error("Please verify username", 5);
    }
  };
  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(profile);
    setVerifyCalled(false);
  };
  const verifyUsername = () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      navigate("/login");
    } else {
      setVerifyCalled(true);
      setValidating(true);
      fetch("https://price-tracker-auth.vercel.app/verifyaccess", {
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
              `https://price-tracker-auth.vercel.app/validateusername/${form.getFieldValue(
                "username"
              )}`
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
                setValidating(false);
                setUserNameVerified(val.verified);
              })
              .catch((err) => {
                setValidating(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view account", 5);
            setValidating(false);
            clearLogout();
            navigate("/login");
          }
        })
        .catch((err) => {
          setValidating(false);
          message.error("Please login to view account", 5);
          clearLogout();
          navigate("/login");
        });
    }
  };

  return (
    <div>
      {Object.keys(profile).length === 0 ? (
        <Space direction="vertical">
          <Skeleton.Input active className="account_skeleton" />
          <Skeleton.Input active className="account_skeleton" />
          <Skeleton.Input active className="account_skeleton" />
        </Space>
      ) : (
        <>
          <div className="account_image_div">
            <ImgCrop rotate>
              <Upload
                action="https://api.cloudinary.com/v1_1/mayur28/image/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                data={{ upload_preset: "juxso4ls" }}
                beforeUpload={beforeUpload}
                multiple={{
                  previewIcon: true,
                  downloadIcon: true,
                  removeIcon: true,
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </div>
          <div>
            <Modal
              open={previewOpen}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              <img
                alt="uploaded_image"
                style={{ width: "100%" }}
                src={previewImage}
              />
            </Modal>
          </div>
          <Form
            layout="vertical"
            form={form}
            name="profile"
            onFinish={onFinish}
            autoComplete="on"
            style={{ marginTop: "40px" }}
          >
            <Space>
              <Form.Item
                name="username"
                label="Username"
                tooltip="Username should be minimum of length 5 and unique!"
                hasFeedback={verifyCalled}
                validateStatus={
                  verifyCalled
                    ? validating
                      ? "validating"
                      : usernameVerified
                      ? "success"
                      : "error"
                    : null
                }
                help={
                  verifyCalled
                    ? validating
                      ? "Validating the username..."
                      : usernameVerified
                      ? "Valid username"
                      : "Invalid username"
                    : null
                }
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  onChange={usernameChanged}
                />
              </Form.Item>
              <Button
                disabled={!usernameChange}
                onClick={verifyUsername}
                type="link"
              >
                Verify
              </Button>
            </Space>
            <Form.Item
              name="name"
              label="Name"
              tooltip="What do you want others to call you?"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
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
              <Button
                style={{ backgroundColor: "#7F4574" }}
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
              >
                Save
              </Button>
              <Button
                htmlType="button"
                style={{
                  margin: "0 8px",
                }}
                onClick={onReset}
              >
                Reset
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default Profile;
