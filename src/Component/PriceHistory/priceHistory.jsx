import React from "react";
import Chart from "react-apexcharts";
import "./priceHistory.css";

const PriceHistory = ({ priceHistory }) => {
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
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default PriceHistory;
