import React, { useEffect, useState } from "react";
import { Image, Typography, message } from "antd";
import { useSearchParams } from "react-router-dom";
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

const { Title } = Typography;

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
  const [searchParams] = useSearchParams();
  const [loading, setloading] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState(0);
  const [currentIntervalTime, setCurrentIntervalTime] = useState(1000);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({});
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
            Swipe and click to learn/see how it works
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
