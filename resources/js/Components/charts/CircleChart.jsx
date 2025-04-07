import React from "react";
import ReactApexChart from "react-apexcharts";

const CircleChart = ({
    value = 75,
    title = "Progression",
    label = "%",
    chartOptions = {},
    className = "",
    color = "#ff0000", // Couleur par défaut (rouge)
    gradientColors = [] // Tableau des couleurs du dégradé
}) => {
    const defaultOptions = {
        chart: {
            type: "radialBar",
            toolbar: { show: false },
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: "70%",
                    background: "#fff",
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.5,
                    },
                },
                track: {
                    background: "#fff",
                    strokeWidth: "67%",
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.7,
                    },
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: "#888",
                        fontSize: "17px",
                    },
                    value: {
                        formatter: (val) => parseInt(val),
                        color: "#111",
                        fontSize: "36px",
                        show: true,
                    },
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "horizontal",
                shadeIntensity: 0.5,
                gradientToColors: gradientColors.length > 0 ? gradientColors : [color],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
            },
        },
        colors: gradientColors.length > 0 ? gradientColors : [color],
        stroke: { lineCap: "round" },
        labels: [label],
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${className}`}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">{title}</h3>
            <ReactApexChart
                options={{ ...defaultOptions, ...chartOptions }}
                series={[value]}
                type="radialBar"
                height={350}
            />
        </div>
    );
};

export default CircleChart;
