import React from 'react'

const RapportQuotidient = ({ className, data }) => {
    const dailyReports = [
        { category: "Installations en panne", count: data.installationenpanne },
        { category: "Interventions effectuées", count: data.intervention },
        { category: "Paiements reçus", count: data.paiement },
        { category: "Alertes principales", count: data.alert },
    ];

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${className}`}>
            <h2 className="text-2xl font-bold text-blue-600 mb-16">📅 Rapport Quotidien</h2>
            {dailyReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-400/10 h-12 p-6 rounded-md mb-2">
                    <div className="">{report.category}</div>
                    <div className="bg-white dark:bg-gray-800 px-4 py-1 rounded-md">{report.count}</div>
                </div>
            ))}
        </div>
    )
}

export default RapportQuotidient;
