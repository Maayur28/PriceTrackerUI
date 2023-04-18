import React, { useState } from "react";
import {
  Image,
  Typography,
  Tag,
  Badge,
  Space,
  Button,
  Divider,
  Col,
  InputNumber,
  Row,
  Slider,
  message,
  Alert,
} from "antd";
import "./pdp.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import fmt from "indian-number-format";
import Paragraph from "antd/es/typography/Paragraph";
import { clearLogout } from "../../Cache";

const { Title, Text } = Typography;

const PDP = ({ searchParam, data }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(1);
  const [loading, setloading] = useState(false);
  const [addedTracker, setaddedTracker] = useState(false);
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePriceAlert = async () => {
    setaddedTracker(false);
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      clearLogout();
      messageApi.open({
        type: "error",
        content: "Please login!!!",
      });
    } else {
      if (inputValue > 0) {
        setloading(true);
        try {
          data.alertPrice = inputValue;
          data.accessToken = Cookies.get("accessToken");
          data.refreshToken = Cookies.get("refreshToken");
          const response = await axios.post(
            "https://price-tracker-auth.vercel.app/addtracker",
            data,
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
              setaddedTracker(true);
              localStorage.removeItem('gettracker');
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
    }
  };

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <>
      {contextHolder}
      <div className="pdp-container">
        <div className="pdp-image-container">
          {data.badge != null &&
          data.badge !== undefined &&
          data.badge !== "" ? (
            <Badge.Ribbon text={data.badge} color="magenta">
              <Image width={250} height={350} src={data.image} />
            </Badge.Ribbon>
          ) : (
            <Image width={250} height={350} src={data.image} />
          )}
        </div>
        <div className="pdp-content-container">
          <Paragraph
            ellipsis={true}
            style={{ margin: "0", fontSize: "18px", fontWeight: "bolder" }}
          >
            {data.title}
          </Paragraph>
          {data.rating.totalRated != null &&
            data.rating.totalRated !== undefined &&
            data.rating.totalRated !== "" && (
              <Tag color="#2F903B" style={{ marginTop: "20px" }}>
                {data.rating.ratingCount} | {data.rating.totalRated}
              </Tag>
            )}
          {Object.keys(data.price).length > 0 ? (
            <div className="pdp-price-container">
              <Title level={2} style={{ margin: "0", marginRight: "10px" }}>
                ₹{fmt.format(data.price.discountPrice)}
              </Title>
              {data.price.discountPrice !== data.price.originalPrice && (
                <>
                  <Text
                    type="secondary"
                    style={{ fontSize: "18px", marginRight: "10px" }}
                    delete
                    strong
                  >
                    ₹{fmt.format(data.price.originalPrice)}
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
                      ((data.price.originalPrice - data.price.discountPrice) /
                        data.price.originalPrice) *
                        100
                    )}
                    % off
                  </Title>
                </>
              )}
            </div>
          ) : (
            <div className="pdp-price-container">
              <Text
                type="secondary"
                style={{ fontSize: "16px", marginRight: "10px" }}
                strong
              >
                Price Not Available
              </Text>
            </div>
          )}
          <Space direction="vertical" wrap className="pdp-button-container">
            <Button block onClick={() => openInNewTab(data.url)}>
              BUY ON {data.domain}
            </Button>
            {!(searchParam != null && searchParam !== undefined) &&
              Object.keys(data.price).length > 0 && (
                <Divider>Set Price Alert</Divider>
              )}
            {addedTracker && (
              <Alert
                message="Confirmation of tracker has been sent over mail.
           We will notify you once the price drops."
                type="success"
                showIcon
                action={
                  <Button size="small" onClick={() => navigate("/trackers")}>
                    My Trackers
                  </Button>
                }
                closable
              />
            )}
            {!(searchParam != null && searchParam !== undefined) &&
              Object.keys(data.price).length > 0 && (
                <>
                  <Row style={{ marginLeft: "10px" }}>
                    <Col span={12}>
                      <Slider
                        min={1}
                        max={data.price.discountPrice - 1}
                        onChange={onChange}
                        value={typeof inputValue === "number" ? inputValue : 1}
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        addonBefore="₹"
                        min={1}
                        max={data.price.discountPrice - 1}
                        style={{
                          width: "120px",
                          margin: "0 16px",
                        }}
                        value={inputValue}
                        onChange={onChange}
                      />
                    </Col>
                  </Row>
                  <Button
                    block
                    type="primary"
                    style={{ backgroundColor: "#EB2F96" }}
                    onClick={handlePriceAlert}
                    loading={loading}
                  >
                    SET PRICE ALERT
                  </Button>
                  <Text type="secondary">
                    We will notify you on email as soon as the price drops
                  </Text>
                </>
              )}
          </Space>
        </div>
      </div>
    </>
  );
};

export default PDP;
