import React, { useEffect, useState } from "react";
import { Input, Image, message } from "antd";
import axios from "axios";
import "./home.css";
import TimelineStatus from "../TimelineStatus/timelineStatus";
import PDP from "../PDP/pdp";
const { Search } = Input;

const Home = () => {
  const [loading, setloading] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState(0);
  const [currentIntervalTime, setCurrentIntervalTime] = useState(1000);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({});
  const client = axios.create({
    baseURL: "https://price-tracker-orchestration.vercel.app",
  });

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentTimeline(currentTimeline + 1);
        setCurrentIntervalTime(Math.floor((Math.random() + 0.5) * 500));
      }, currentIntervalTime);

      return () => clearInterval(interval);
    }
  }, [currentIntervalTime, currentTimeline, loading]);

  const validateURL = (val) => {
    var res = val.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
  };

  const onSearch = async (val) => {
    if (val != null && val !== undefined && val !== "" && validateURL(val)) {
      setloading(true);
      setData({});
      val = val.trim();
      try {
        let response = await client.get(`/scrap?url=${val}`);
        if (
          response.status === 200 &&
          response.data != null &&
          response.data !== undefined &&
          response.data !== ""
        ) {
          setData(response.data);
        }
        setCurrentTimeline(0);
        setloading(false);
      } catch (error) {
        setloading(false);
        setCurrentTimeline(0);
        messageApi.open({
          type: "error",
          content: error.response.data,
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
      <Search
        className="search-component"
        placeholder="Paste your url"
        allowClear
        loading={loading}
        size="large"
        onSearch={onSearch}
      />
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
      {!loading && Object.keys(data).length > 0 && <PDP data={data} />}
    </div>
  );
};

export default Home;
