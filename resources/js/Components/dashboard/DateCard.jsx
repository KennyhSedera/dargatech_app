import React, { useState, useEffect } from "react";

const DateCard = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const dateComponents = {
        day: date.getDate(),
        monthName: date.toLocaleDateString("fr-FR", { month: "short" }),
        hour: date.getHours(),
        minute: date.getMinutes(),
    };

    const { day, monthName, hour, minute } = dateComponents;

    return (
        <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-2 px-10 py-4 transition-all duration-300 rounded-md shadow-md cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl hover:scale-105 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-600">
                <div className="flex flex-col items-start">
                    <span className="font-bold text-transparent transform scale-x-75 scale-y-125 text-7xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
                        {day}
                    </span>
                    <span className="text-3xl text-blue-500 capitalize transform scale-x-75 opacity-50 dark:text-blue-400">
                        {monthName}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 px-10 py-4 transition-all duration-300 rounded-md shadow-md cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl hover:scale-105 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-600">
                <span className="text-5xl font-bold text-transparent transform scale-x-75 scale-y-110 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
                    {hour < 10 ? "0" + hour : "" + hour}
                </span>
                <div className="flex flex-row items-center gap-1">
                    <div className="w-4 h-1 bg-blue-600 opacity-50 dark:bg-blue-400" />
                    <div className="w-4 h-1 bg-blue-800 opacity-50 dark:bg-blue-600" />
                </div>
                <span className="text-5xl font-bold text-transparent transform scale-x-75 scale-y-110 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
                    {minute < 10 ? "0" + minute : "" + minute}
                </span>
            </div>
        </div>
    );
};

export default DateCard;
