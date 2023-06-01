import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Image,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import TimelineStatus from "../TimelineStatus/timelineStatus";
import PDP from "../PDP/pdp";
import PriceHistory from "../PriceHistory/priceHistory";
import { fetchData } from "../../Apis";
import { validateURL } from "./homeUtil";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./home.css";
import Cookies from "js-cookie";
import SearchComponent from "./SearchComponent";
import { clearLogout } from "../../Cache";
import fmt from "indian-number-format";
import Meta from "antd/es/card/Meta";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { LineChartOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const carousel = (slider) => {
  const z = 300;
  function rotate() {
    const deg = 360 * slider.track.details.progress;
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
  }
  slider.on("created", () => {
    const deg = 360 / slider.slides.length;
    slider.slides.forEach((element, idx) => {
      element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`;
    });
    rotate();
  });
  slider.on("detailsChanged", rotate);
};

const Home = () => {
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setloading] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState(0);
  const [currentIntervalTime, setCurrentIntervalTime] = useState(1000);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({});
  const [droppedPrice, setDroppedPrice] = useState([]);
  const [priceHistory, setpriceHistory] = useState({});

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentTimeline(currentTimeline + 1);
        setCurrentIntervalTime(Math.floor((Math.random() + 1) * 500));
      }, currentIntervalTime);

      return () => clearInterval(interval);
    }
  }, [currentIntervalTime, currentTimeline, loading]);

  useEffect(() => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    )
      clearLogout();
    fetch(`https://lobster-app-5zvv7.ondigitalocean.app/getDroppedPrice`)
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((val) => {
        if (val.data != null && val.data !== undefined) {
          setDroppedPrice(val.data);
        } else {
          setDroppedPrice([]);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      selector: ".carousel__cell",
      renderMode: "custom",
      mode: "free-snap",
    },
    [carousel]
  );

  const onSearch = async (val) => {
    setCurrentTimeline(0);
    if (val != null && val !== undefined && val !== "" && validateURL(val)) {
      setloading(true);
      setData({});
      val = val.trim();
      try {
        let response = await fetchData(val);
        if (response != null) {
          if (
            response.data != null &&
            response.data !== undefined &&
            response.data !== ""
          ) {
            setData(response.data);
          }
          if (
            response.priceHistory != null &&
            response.priceHistory !== undefined &&
            response.priceHistory !== ""
          ) {
            setpriceHistory(response.priceHistory);
          }
        }
        setCurrentTimeline(0);
        setloading(false);
      } catch (error) {
        setloading(false);
        setCurrentTimeline(0);
        messageApi.open({
          type: "error",
          content: "Please try again",
        });
      }
    }
  };

  return (
    <div className="home-component">
      {contextHolder}
      <Image
        width={250}
        preview={false}
        src="/pricetracker-high-resolution-logo-color-on-transparent-background (1).png"
      />
      <div style={{ display: "flex" }}>
        <SearchComponent
          loading={loading}
          searchParams={searchParams}
          onSearch={onSearch}
        />
      </div>
      {!loading && Object.keys(data).length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <Title
              level={4}
              style={{
                color: "white",
                fontWeight: "bolder",
                width: "100vw",
                position: "absolute",
                margin: "auto",
                bottom: "1%",
                marginBottom: 10,
              }}
            >
              Swipe and click to explore website functionality.
            </Title>
            <div
              className="wrapper"
              style={{
                width: "100vw",
                height: window.innerHeight - 276,
                display: "flex",
                alignItems: "center",
                backgroundImage: "url(/wave1.png)",
              }}
            >
              <div className="scene">
                <div className="carousel keen-slider" ref={sliderRef}>
                  {[
                    "slide1",
                    "slide2",
                    "slide3",
                    "slide4",
                    "slide5",
                    "slide6",
                    "slide7",
                    "slide8",
                    "slide9",
                    "slide10",
                  ].map((val, index) => (
                    <div
                      className={`carousel__cell number-${val}`}
                      key={`index_${index}_${val}`}
                    >
                      <Image
                        width="100%"
                        height="100%"
                        src={`/PriceTrackerCarousel/${val}.png`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {droppedPrice && droppedPrice.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0px",
                  marginLeft: "20px",
                  textAlign: "left",
                }}
              >
                <Title level={2}>Price Dropped</Title>
                <Link
                  href="#latestdeals"
                  id="latestdeals"
                  type="secondary"
                  style={{
                    marginLeft: "30px",
                    marginTop: "12px",
                    fontSize: "22px",
                  }}
                >
                  #latest deals
                </Link>
              </div>
              <Divider />
              {droppedPrice && droppedPrice.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {droppedPrice.map((val, index) => (
                    <Card
                      key={index}
                      style={{
                        width: 350,
                        marginLeft: "20px",
                        marginBottom: "20px",
                      }}
                      actions={[
                        <>
                          <Button
                            onClick={() => navigate(`/?url=${val.url}`)}
                            type="text"
                            icon={<LineChartOutlined />}
                          >
                            View Price History
                          </Button>
                          <Button
                            type="text"
                            style={{
                              width: "90%",
                              maxWidth: "145px",
                            }}
                            onClick={() =>
                              window.open(
                                val.url,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <Text strong>BUY ON {val.domain}</Text>
                          </Button>
                        </>,
                      ]}
                      cover={
                        <img
                          width="200px !important"
                          height="200px"
                          style={{ padding: "25px" }}
                          alt={val.title}
                          src={val.image}
                        />
                      }
                    >
                      <Meta
                        title={val.title}
                        description={
                          <>
                            <div className="pdp-price-container">
                              <Title
                                level={2}
                                style={{ margin: "0", marginRight: "10px" }}
                              >
                                ₹{fmt.format(val.droppedPrice.price)}
                              </Title>
                              {val.droppedPrice.pricee !==
                                val.originalPrice && (
                                <>
                                  <Text
                                    type="secondary"
                                    style={{
                                      fontSize: "18px",
                                      marginRight: "10px",
                                    }}
                                    delete
                                    strong
                                  >
                                    ₹{fmt.format(val.originalPrice)}
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
                                      ((val.originalPrice -
                                        val.droppedPrice.price) /
                                        val.originalPrice) *
                                        100
                                    )}
                                    % off
                                  </Title>
                                </>
                              )}
                            </div>
                            <div style={{ textAlign: "left" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Text strong>Previous Price : &nbsp;</Text>
                                <div
                                  style={{
                                    width: "195px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    type="warning"
                                    keyboard
                                    style={{ fontSize: "18px" }}
                                  >
                                    ₹{fmt.format(val.previousPrice.price)}
                                  </Text>
                                  <Text type="secondary">
                                    {val.previousPrice &&
                                      val.previousPrice.date &&
                                      val.previousPrice.date.split("T")[0]}
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{ marginTop: "10px", textAlign: "left" }}
                            >
                              <Space size={[0, "small"]}>
                                <Tag bordered={false} color="#87D068">
                                  MinPrice:&nbsp; ₹
                                  {fmt.format(val.minimumPrice.price)}
                                </Tag>
                                <Tag bordered={false} color="#CD201F">
                                  MaxPrice:&nbsp; ₹
                                  {fmt.format(val.maximumPrice.price)}
                                </Tag>
                              </Space>
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                right: "2%",
                                top: "0%",
                              }}
                            >
                              <Text type="secondary">
                                {isNaN(Number(val.droppedPrice.date))
                                  ? "1 hour ago"
                                  : timeAgo.format(
                                      Number(val.droppedPrice.date)
                                    )}
                              </Text>
                            </div>
                            <Alert
                              style={{ marginTop: "10px" }}
                              message={`PRICE DROPPED BY ₹${fmt.format(
                                Math.floor(
                                  (val.previousPrice.price -
                                    val.droppedPrice.price) *
                                    100
                                ) / 100
                              )}
                              `}
                              type="info"
                            />
                          </>
                        }
                      />
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className="timeline-container"
            style={{
              visibility: `${loading ? "visible" : "hidden"}`,
              display: `${
                !loading && Object.keys(data).length > 0 ? "none" : "block"
              }`,
            }}
          >
            <TimelineStatus currentTimeline={currentTimeline} />
          </div>
          <div>
            {!loading && Object.keys(data).length > 0 && (
              <PDP
                searchParam={searchParams ? searchParams.get("url") : null}
                data={data}
              />
            )}
            {!loading && Object.keys(priceHistory).length > 0 && (
              <PriceHistory priceHistory={priceHistory} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
