import React from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({
    seriesData = [
        { x: new Date("2024-01-01").getTime(), y: 31 },
        { x: new Date("2024-01-02").getTime(), y: 40 },
        { x: new Date("2024-01-03").getTime(), y: 28 },
        { x: new Date("2024-01-04").getTime(), y: 51 },
        { x: new Date("2024-01-05").getTime(), y: 42 },
        { x: new Date("2024-01-06").getTime(), y: 65 },
        { x: new Date("2024-01-07").getTime(), y: 70 },
    ],
    title = "Analyse des Mouvements Boursiers",
    subtitle = "",
    chartOptions = {},
    className = "",
    name = "Valeurs"
}) => {
    const defaultOptions = {
        chart: {
            type: "area",
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        grid: { show: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        title: {
            text: title,
            align: "left",
            style: { color: "#4f46e5", fontSize: "18px", fontWeight: 600 },
        },
        subtitle: {
            text: subtitle,
            align: "left",
            style: { color: "#6366f1", fontSize: "14px" },
        },
        xaxis: {
            type: "category",
            labels: { style: { colors: "#22c55e", fontSize: "12px" } },
        },
        yaxis: {
            title: { text: name, style: { color: "#3b82f6" } },
            labels: { style: { colors: "#3b82f6", fontSize: "12px" } },
            opposite: true,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.2,
                stops: [20, 100],
            },
        },
        tooltip: {
            theme: "dark",
        },
        legend: { position: "top", horizontalAlign: "right" },
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${className}`}>
            <ReactApexChart
                options={{ ...defaultOptions, ...chartOptions }}
                series={[{ name, data: seriesData }]}
                type="area"
                height={350}
            />
        </div>
    );
};

export default AreaChart;
