import React from "react";

const RapportQuotidient = ({ className, data = {} }) => {
    const defaultData = {
        installationenpanne: 0,
        intervention: 0,
        paiement: 0,
        alert: 0,
        ...data,
    };

    const dailyReports = [
        {
            category: "Installations en panne",
            count: defaultData.installationenpanne,
        },
        {
            category: "Interventions effectuées",
            count: defaultData.intervention,
        },
        { category: "Paiements reçus", count: defaultData.paiement },
    ];

    const currentDate = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("fr-FR", options);

    return (
        <div
            className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${
                className || ""
            }`}
        >
            <div className="flex flex-col mb-6">
                <h2 className="text-2xl font-bold text-blue-600">
                    📅 Rapport Quotidien
                </h2>
                <p className="mt-2 text-sm text-gray-600 capitalize dark:text-gray-400">
                    {formattedDate}
                </p>
            </div>
            {dailyReports.map((report, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between h-20 p-6 mb-2 rounded-md bg-gray-400/10"
                >
                    <div className="">{report.category}</div>
                    <div className="px-4 py-1 bg-white rounded-md dark:bg-gray-800">
                        {report.count}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RapportQuotidient;
