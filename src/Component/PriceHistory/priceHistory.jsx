import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Segmented } from "antd";
import "./priceHistory.css";

const PriceHistory = ({ priceHistory }) => {
  const [current, setcurrent] = useState("line");

  const options = {
    xaxis: {
      categories: priceHistory.dates,
    },
  };
  const series = [
    {
      name: "priceHistory",
      data: priceHistory.prices,
    },
  ];
  return (
    <div className="price_history-container">
      <Segmented
        style={{ marginBottom: "50px" }}
        block
        onChange={(value) => setcurrent(value)}
        defaultValue={current}
        options={["bar", "line", "area"]}
      />
      <Chart options={options} series={series} type={current} height={300} />
    </div>
  );
};

export default PriceHistory;
