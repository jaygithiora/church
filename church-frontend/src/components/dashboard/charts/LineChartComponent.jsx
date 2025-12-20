import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const LineChartComponent = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy chart before unmounting
      }
    };
  }, []);

  return <Line ref={chartRef} data={data} options={options} />;
};

export default LineChartComponent;