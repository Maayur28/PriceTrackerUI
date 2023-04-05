import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  message,
  Card,
  Typography,
  Tag,
  Divider,
  InputNumber,
  Space,
  Button,
  Form,
  Skeleton,
} from "antd";
import { CloseOutlined, CheckOutlined, EditOutlined } from "@ant-design/icons";
import fmt from "indian-number-format";
import "./trackers.css";

const { Meta } = Card;
const { Title, Text } = Typography;

const Trackers = () => {
  const containerWidth = window.innerWidth;
  console.log(containerWidth);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [edit, setEdit] = useState("");
  const [data, setData] = useState([]);
  const [alertPrice, setalertPrice] = useState(0);

  const fetchTracker = async () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      messageApi.open({
        type: "error",
        content: "Login to view trackers",
      });
      navigate("/login");
    } else {
      setloading(true);
      try {
        const response = await axios.post(
          "https://price-tracker-auth.vercel.app/gettracker",
          JSON.stringify({
            accessToken: Cookies.get("accessToken"),
            refreshToken: Cookies.get("refreshToken"),
          }),
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== ""
        ) {
          if (response.data) {
            setData(response.data.data);
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  useEffect(() => {
    fetchTracker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAlertPrice = async () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      messageApi.open({
        type: "error",
        content: "Please login!!!",
      });
    } else {
      if (alertPrice > 0) {
        setloading(true);
        try {
          let obj = {};
          obj.alertPrice = alertPrice;
          obj.productId = edit;
          obj.accessToken = Cookies.get("accessToken");
          obj.refreshToken = Cookies.get("refreshToken");
          const response = await axios.put(
            "https://price-tracker-auth.vercel.app/updatetracker",
            obj,
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );
          if (
            response.status === 200 &&
            response.data != null &&
            response.data !== undefined &&
            response.data !== ""
          ) {
            if (response.data) {
              setData(response.data.data);
              messageApi.open({
                type: "success",
                content: "Updated",
              });
            }
          }
          setloading(false);
          setEdit("");
          setalertPrice(0);
        } catch (error) {
          setloading(false);
          messageApi.open({
            type: "error",
            content: error.response.data,
          });
        }
      }
    }
  };

  const handleEdit = (productId) => {
    setalertPrice(0);
    setEdit(productId);
  };

  const handleDelete = async (productId) => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      messageApi.open({
        type: "error",
        content: "Please login!!!",
      });
    } else {
      setloading(true);
      try {
        let obj = {};
        obj.productId = productId;
        obj.accessToken = Cookies.get("accessToken");
        obj.refreshToken = Cookies.get("refreshToken");
        const response = await axios.put(
          "https://price-tracker-auth.vercel.app/deletetracker",
          obj,
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== ""
        ) {
          if (response.data) {
            setData(response.data.data);
            messageApi.open({
              type: "success",
              content: "Deleted",
            });
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="trackers-container">
        {loading ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            <Skeleton.Input
              active={true}
              style={{ width: "30vw", height: "400px", margin: "5px" }}
            />
            <Skeleton.Input
              active={true}
              style={{ width: "30vw", height: "400px", margin: "5px" }}
            />
            <Skeleton.Input
              active={true}
              style={{ width: "30vw", height: "400px", margin: "5px" }}
            />
          </div>
        ) : (
          <>
            {data != null && data !== undefined && data.length > 0 ? (
              data.map((val, index) => (
                <Card
                  key={`tracker${index}`}
                  style={{
                    width:
                      containerWidth <= 650
                        ? "90vw"
                        : containerWidth > 650 && containerWidth <= 900
                        ? "44vw"
                        : containerWidth > 900 && containerWidth <= 1200
                        ? "400px"
                        : "30vw",
                    height: 520,
                    margin: "15px",
                  }}
                  cover={
                    <img
                      alt="product_image"
                      src={val.image}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        width: "250px",
                        height: "250px",
                      }}
                    />
                  }
                >
                  <CloseOutlined
                    className="tracker-close-button"
                    onClick={() => handleDelete(val.productId)}
                  />
                  <Meta
                    title={val.title}
                    description={
                      <div style={{ textAlign: "left" }}>
                        {val.rating.totalRated != null &&
                          val.rating.totalRated !== undefined &&
                          val.rating.totalRated !== "" && (
                            <Tag color="#2F903B">
                              {val.rating.ratingCount} | {val.rating.totalRated}
                            </Tag>
                          )}
                        <div className="pdp-price-container">
                          <Title
                            level={2}
                            style={{ margin: "0", marginRight: "5px" }}
                          >
                            ₹{fmt.format(val.price.discountPrice)}
                          </Title>
                          {val.price.discountPrice !==
                            val.price.originalPrice && (
                            <>
                              <Text
                                type="secondary"
                                style={{
                                  fontSize: "18px",
                                  marginRight: "5px",
                                }}
                                delete
                                strong
                              >
                                ₹{fmt.format(val.price.originalPrice)}
                              </Text>
                              <Title
                                level={5}
                                style={{
                                  color: "#07976A",
                                  fontWeight: "bolder",
                                  margin: "0",
                                }}
                              >
                                {Math.floor(
                                  ((val.price.originalPrice -
                                    val.price.discountPrice) /
                                    val.price.originalPrice) *
                                    100
                                )}
                                % off
                              </Title>
                            </>
                          )}
                        </div>
                        <Divider>Alert Price</Divider>
                        <Space.Compact
                          style={{
                            width: "100%%",
                          }}
                        >
                          <Form.Item>
                            <InputNumber
                              name="alertPrice"
                              addonBefore="₹"
                              min={1}
                              max={val.price.discountPrice - 1}
                              value={val.alertPrice}
                              readOnly={val.productId !== edit}
                              onChange={(value) => setalertPrice(value)}
                            />
                          </Form.Item>
                          <Form.Item>
                            {edit === val.productId ? (
                              <Button
                                icon={<CheckOutlined />}
                                size="smmall"
                                style={{
                                  color: "white",
                                  backgroundColor: "#7F4574",
                                }}
                                type="primary"
                                onClick={handleAlertPrice}
                                disabled={
                                  alertPrice === 0 ||
                                  alertPrice === val.alertPrice
                                }
                              >
                                Update
                              </Button>
                            ) : (
                              <Button
                                icon={<EditOutlined />}
                                size="smmall"
                                onClick={() => handleEdit(val.productId)}
                              >
                                Edit
                              </Button>
                            )}
                          </Form.Item>
                        </Space.Compact>
                      </div>
                    }
                  />
                </Card>
              ))
            ) : (
              <>{JSON.stringify(data)}</>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Trackers;
