import React, { useEffect, useState } from "react";
import DataTable from "../DataTable";
import { formatDate } from "@/hooks/fomatDate";

const PompageComponent = ({ id }) => {
    const [cumulerData, setCumulerData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState(null);

    const getPompage = async () => {
        const res = await fetch(`/api/installations/${id}/calcul`);
        const data = await res.json();
        setCumulerData(data.tableau_cumule);
        setData(data.data);
    };

    useEffect(() => {
        if (id) {
            getPompage();
        }
    }, [id]);

    const headers = [
        {
            key: "jour",
            label: "ID",
            sortable: true,
        },
        {
            key: "volume_cumule_m3",
            label: "Volume cumulé (m³)",
        },
        {
            key: "co2_cumule_kg",
            label: "CO2 évité (kg)",
        },
        {
            key: "date",
            label: "Date",
            sortable: true,
            customRender: (value) => formatDate(value),
        },
        {
            key: "pompage_actif",
            label: "Pompage",
            customRender: (value) => <div>{value ? "Oui" : "Non"}</div>,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="md:col-span-3">
                <div className="p-2 bg-white rounded-lg shadow-md">
                    <DataTable
                        headers={headers}
                        rows={cumulerData}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(n) => setItemsPerPage(n)}
                    />
                </div>
            </div>
            <div>
                <div className="h-auto p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="pb-2 mb-2 text-lg text-gray-500 border-b border-b-gray-200">
                        Nombre de jours :{" "}
                        <span className="text-xl font-bold text-black dark:text-white">
                            {data?.nombre_jours} jours
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Date début :{" "}
                        <span className="text-base font-bold text-black dark:text-white">
                            {formatDate(data?.date_installation)}
                        </span>
                    </div>
                    <div className="pb-2 mb-2 text-sm text-gray-500 border-b border-b-gray-200">
                        Date fin :{" "}
                        <span className="text-base font-bold text-black dark:text-white">
                            {formatDate(data?.date_fin)}
                        </span>
                    </div>
                    <div className="mt-2">
                        <div className="text-sm text-gray-500">
                            Volume totaux cumulé
                        </div>
                        <div className="text-xl font-bold">
                            {data?.volume_total_m3} m³
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="text-sm text-gray-500">
                            Total CO2 évité
                        </div>
                        <div className="text-xl font-bold">
                            {data?.co2_total_kg} kg
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PompageComponent;
