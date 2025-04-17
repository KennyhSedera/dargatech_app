import React from 'react'

const RapportQuotidient = ({ className, data = {} }) => {
    // Provide default values in case data properties are undefined
    const defaultData = {
        installationenpanne: 0,
        intervention: 0,
        paiement: 0,
        alert: 0,
        ...data
    };

    const dailyReports = [
        { category: "Installations en panne", count: defaultData.installationenpanne },
        { category: "Interventions effectuées", count: defaultData.intervention },
        { category: "Paiements reçus", count: defaultData.paiement },
        { category: "Alertes principales", count: defaultData.alert },
    ];

    // Format the current date in French
    const currentDate = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = currentDate.toLocaleDateString('fr-FR', options);

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-md ${className || ''}`}>
            <div className="flex flex-col mb-6">
                <h2 className="text-2xl font-bold text-blue-600">📅 Rapport Quotidien</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 capitalize">{formattedDate}</p>
            </div>
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