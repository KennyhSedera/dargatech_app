import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({
    seriesData = [
        { x: new Date("2024-01-01").getTime(), y: 30 },
        { x: new Date("2024-01-02").getTime(), y: 40 },
        { x: new Date("2024-01-03").getTime(), y: 35 },
        { x: new Date("2024-01-04").getTime(), y: 50 },
        { x: new Date("2024-01-05").getTime(), y: 49 },
        { x: new Date("2024-01-06").getTime(), y: 60 },
        { x: new Date("2024-01-07").getTime(), y: 70 },
        { x: new Date("2024-01-08").getTime(), y: 91 },
    ],
    title = "Évolution des valeurs",
    xLabelColor = "#22c55e",
    yLabelColor = "#3b82f6",
    chartOptions = {},
    className = "",
}) => {
    const defaultOptions = {
        chart: { id: "fixed-data", type: "line", toolbar: { show: false }, zoom: { enabled: false } },
        grid: { show: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        title: { text: title, align: "left", style: { color: "#ff6b6b" } },
        markers: { size: 4, colors: ["#ff6b6b"], strokeWidth: 2 },
        xaxis: {
            type: "datetime",
            labels: { style: { colors: xLabelColor, fontSize: "14px", fontWeight: 600 } },
        },
        yaxis: {
            max: 100,
            labels: { style: { colors: yLabelColor, fontSize: "14px", fontWeight: 600 } },
        },
        tooltip: {
            theme: "dark",
        },
        legend: { show: false },
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-md p-4 shadow-md ${className}`}>
            <ReactApexChart options={{ ...defaultOptions, ...chartOptions }} series={[{ name: "Valeurs", data: seriesData }]} type="line" height={350} />
        </div>
    );
};

export default LineChart;
