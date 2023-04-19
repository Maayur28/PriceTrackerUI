import React, { useEffect, useState } from "react";
import { Image, message } from "antd";
import { useSearchParams } from "react-router-dom";
import TimelineStatus from "../TimelineStatus/timelineStatus";
import PDP from "../PDP/pdp";
import PriceHistory from "../PriceHistory/priceHistory";
import { fetchData } from "../../Apis";
import { validateURL } from "./homeUtil";
import "./home.css";
import SearchComponent from "./SearchComponent";

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
          <Image
            width="100vw"
            height={window.innerHeight - 280}
            preview={false}
            src="/wave.png"
          />
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
