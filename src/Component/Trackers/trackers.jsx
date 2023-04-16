import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  message,
  Card,
  Typography,
  Tag,
  InputNumber,
  Space,
  Button,
  Form,
  Image,
  Spin,
  Popover,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
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
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const [data, setData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState("");
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
        setbuttonLoading(true);
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
          setbuttonLoading(false);
          setEdit("");
          setalertPrice(0);
        } catch (error) {
          setbuttonLoading(false);
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
      try {
        setDeleteLoading(productId);
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
            setDeleteLoading("");
            messageApi.open({
              type: "success",
              content: "Deleted",
            });
          }
        }
      } catch (error) {
        setDeleteLoading("");
        messageApi.open({
          type: "error",
          content: error.response.data,
        });
      }
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const content = (val) => (
    <Space.Compact style={{ width: "220px" }}>
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
            disabled={alertPrice === 0 || alertPrice === val.alertPrice}
            loading={buttonLoading}
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
  );

  return (
    <>
      {contextHolder}
      <Spin tip="Loading..." spinning={loading}>
        <div className="trackers-container">
          {!loading && (
            <>
              {data != null && data !== undefined && data.length > 0 ? (
                data.map((val, index) => (
                  <Spin spinning={deleteLoading === val.productId}>
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
                        height: 455,
                        margin: "15px",
                      }}
                      actions={[
                        <Button
                          type="text"
                          style={{ width: "90%", maxWidth: "100px" }}
                          icon={<LineChartOutlined />}
                        >
                          History
                        </Button>,
                        <>
                          <Popover
                            trigger="click"
                            content={content(val)}
                            title="Update Alert Price"
                          >
                            <Button
                              type="text"
                              style={{ width: "90%", maxWidth: "120px" }}
                              icon={<EditOutlined />}
                            >
                              Alert Price
                            </Button>
                          </Popover>
                        </>,
                        <Button
                          type="text"
                          style={{
                            width: "90%",
                            maxWidth: "120px",
                          }}
                          onClick={() => openInNewTab(val.url)}
                          icon={
                            <Image
                              style={{ margin: "0", paddingRight: "6px" }}
                              preview={false}
                              src={
                                val.domain === "FLIPKART"
                                  ? "/flipkart.png"
                                  : "/amazon.png"
                              }
                            />
                          }
                        >
                          {val.domain}
                        </Button>,
                      ]}
                      cover={
                        <img
                          alt="product_image"
                          src={val.image}
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            width: "280px",
                            height: "220px",
                          }}
                        />
                      }
                    >
                      <CloseOutlined
                        className="tracker-close-button"
                        onClick={() => handleDelete(val.productId)}
                      />
                      <Meta
                        style={{ textAlign: "left" }}
                        title={val.title}
                        description={
                          <div>
                            {val.rating != null &&
                            val.rating !== undefined &&
                            val.rating.totalRated != null &&
                            val.rating.totalRated !== undefined &&
                            val.rating.totalRated !== "" ? (
                              <Tag color="#2F903B">
                                {val.rating.ratingCount} |{" "}
                                {val.rating.totalRated}
                              </Tag>
                            ) : (
                              <Tag color="#C6C6C6">Not Rated</Tag>
                            )}
                            {Object.keys(val.price).length > 0 && (
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
                            )}
                            {/* <div>
                              <Divider style={{ margin: "10px" }}>
                                Alert Price & Buy On
                              </Divider>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Space.Compact
                                  style={{
                                    width: "70%",
                                    minWidth: "150px",
                                    display: "flex",
                                    justifyContent: "center",
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
                                        loading={buttonLoading}
                                      >
                                        Update
                                      </Button>
                                    ) : (
                                      <Button
                                        icon={<EditOutlined />}
                                        size="smmall"
                                        onClick={() =>
                                          handleEdit(val.productId)
                                        }
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </Form.Item>
                                </Space.Compact>
                                <div>
                                  {val.domain === "FLIPKART" ? (
                                    <Button
                                      onClick={() => openInNewTab(val.url)}
                                      style={{
                                        margin: "0",
                                        backgroundColor: "#F9DE21",
                                        color: "#107BD4",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      {val.domain}
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        openInNewTab(
                                          val.url + "?tag=mayur280e-21"
                                        )
                                      }
                                      style={{
                                        margin: "0",
                                        backgroundColor: "#FF9900",
                                        color: "white",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      {val.domain}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div> */}
                          </div>
                        }
                      />
                    </Card>
                  </Spin>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "70vh",
                  }}
                >
                  <Image
                    preview={false}
                    src="/empty-cart.gif"
                    width="60vw"
                    height="40vh"
                  />
                  <Text style={{ fontSize: "40px", fontWeight: "bolder" }}>
                    Your tracking list is empty
                  </Text>
                  <Text style={{ fontSize: "24px", fontWeight: "400" }}>
                    Looks like you have not added anything to your tracking
                    list.
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </Spin>
    </>
  );
};

export default Trackers;
