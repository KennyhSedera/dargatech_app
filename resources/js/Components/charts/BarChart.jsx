import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({
    series = [
        { name: "Net Profit", data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
        { name: "Revenue", data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
        { name: "Free Cash Flow", data: [35, 41, 36, 26, 45, 48, 52, 53, 41] },
    ],
    categories = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    title = "Chiffre d'affaires mensuel",
    xLabelColor = "#FF5733",
    yLabelColor = "#2ecc71",
    chartOptions = {},
    yaxistitle = 'title',
    tooltip = '',
    className = "",
}) => {
    const defaultOptions = {
        chart: { type: "bar", toolbar: { show: false } },
        grid: { show: false },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories,
            labels: { style: { colors: xLabelColor, fontSize: "14px", fontWeight: "bold" } },
        },
        yaxis: {
            title: {
                text: yaxistitle,
                style: { color: "#3498db", fontSize: "16px", fontWeight: "bold" },
            },
            labels: { style: { colors: yLabelColor, fontSize: "14px" } },
        },
        fill: { opacity: 1 },
        tooltip: {
            theme: "dark",
            y: { formatter: (val) => `${new Intl.NumberFormat().format(val)} ${tooltip}` },
        },
        title: {
            text: title,
            align: "center",
            style: { color: "#8e44ad", fontSize: "18px", fontWeight: "bold" },
        },
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${className}`}>
            <ReactApexChart options={{ ...defaultOptions, ...chartOptions }} series={series} type="bar" height={350} />
        </div>
    );
};

export default BarChart;
