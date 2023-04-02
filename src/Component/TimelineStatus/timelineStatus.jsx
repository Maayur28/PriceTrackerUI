import React from "react";
import { Timeline } from "antd";
import { SyncOutlined } from "@ant-design/icons";

import "./timelineStatus.css";

const TimelineStatus = ({currentTimeline}) => {
  return (
    <div>
      <Timeline mode="right" style={{ width: "300px" }}>
        <Timeline.Item
          label={
            <span className="timeline-text">
              Analyzing{currentTimeline === 0 && "..."}
            </span>
          }
          dot={
            currentTimeline === 0 && (
              <SyncOutlined
                spin
                style={{
                  color: "#1890FF",
                  fontSize: "14px",
                }}
              />
            )
          }
          color={currentTimeline > 0 && "green"}
        ></Timeline.Item>
        <Timeline.Item
          label={
            <span className="timeline-text">
              Validating{currentTimeline === 1 && "..."}
            </span>
          }
          dot={
            currentTimeline === 1 && (
              <SyncOutlined
                spin
                style={{
                  color: "#1890FF",
                  fontSize: "14px",
                }}
              />
            )
          }
          color={currentTimeline > 1 ? "green" : "grey"}
        ></Timeline.Item>
        <Timeline.Item
          label={
            <span className="timeline-text">
              Fetching{currentTimeline === 2 && "..."}
            </span>
          }
          dot={
            currentTimeline === 2 && (
              <SyncOutlined
                spin
                style={{
                  color: "#1890FF",
                  fontSize: "14px",
                }}
              />
            )
          }
          color={currentTimeline > 2 ? "green" : "grey"}
        ></Timeline.Item>
        <Timeline.Item
          label={
            <span className="timeline-text">
              Almost Completed
              {currentTimeline >= 3 && currentTimeline <= 9 && "..."}
            </span>
          }
          dot={
            currentTimeline >= 3 &&
            currentTimeline <= 9 && (
              <SyncOutlined
                spin
                style={{
                  color: "#1890FF",
                  fontSize: "14px",
                }}
              />
            )
          }
          color={currentTimeline >= 10 ? "red" : "grey"}
        ></Timeline.Item>
      </Timeline>
    </div>
  );
};

export default TimelineStatus;
