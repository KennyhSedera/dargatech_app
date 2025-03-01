import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardComponent = () => {
    const dailyReports = [
        { category: "Installations en panne", count: 5 },
        { category: "Interventions effectuées", count: 12 },
        { category: "Paiements reçus", count: 8 },
        { category: "Alertes principales", count: 3 },
    ];

    const monthlyStats = {
        availabilityRate: 92,
        systemPerformance: [78, 85, 90, 88, 95],
        paymentsStatus: { paid: 150, pending: 30 },
        maintenanceSummary: { planned: 20, completed: 18 },
    };

    const systemPerformanceOptions = {
        chart: { type: "line", height: 300 },
        xaxis: { categories: ["Jan", "Fév", "Mar", "Avr", "Mai"] },
        yaxis: { title: { text: "Performance (%)" } },
        stroke: { curve: "smooth" },
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">📅 Rapport Quotidien</h2>
                {dailyReports.map((report, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="">{report.category}</div>
                        <div className="">{report.count}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-green-600">📊 Rapport Mensuel</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md text-center">
                    <h3 className="text-lg font-semibold">📈 Taux de disponibilité</h3>
                    <p className="text-3xl text-green-500 font-bold">{monthlyStats.availabilityRate}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md text-center">
                    <h3 className="text-lg font-semibold">💰 État des paiements</h3>
                    <p className="text-green-500">✅ Payés : {monthlyStats.paymentsStatus.paid}</p>
                    <p className="text-red-500">❌ En attente : {monthlyStats.paymentsStatus.pending}</p>
                </div>
                <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-blue-600">📡 Performance des systèmes</h3>
                    <ReactApexChart
                        options={systemPerformanceOptions}
                        series={[{ name: "Performance", data: monthlyStats.systemPerformance }]}
                        type="line"
                        height={300}
                    />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md text-center">
                    <h3 className="text-lg font-semibold">🔧 Synthèse des maintenances</h3>
                    <p className="text-blue-500">📌 Planifiées : {monthlyStats.maintenanceSummary.planned}</p>
                    <p className="text-green-500">✅ Réalisées : {monthlyStats.maintenanceSummary.completed}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;
