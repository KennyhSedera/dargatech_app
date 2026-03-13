import DataTable from "@/Components/DataTable";
import EmptyState from "@/Components/EmptyState";
import HeaderPage from "@/Components/HeaderPage";
import { formatDate } from "@/hooks/fomatDate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

const PompagePage = () => {
    const [search, setSearch] = React.useState("");
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const headers = [
        {
            key: "code_installation",
            label: "Code",
            sortable: true,
            customRender: (value) => (
                <span className="px-4 py-1 text-sm text-green-600 rounded-full bg-green-500/15">
                    {value}
                </span>
            ),
        },
        { key: "maraicher", label: "Nom client", sortable: true },
        {
            key: "date_installation",
            label: "Date de l'installation",
            sortable: true,
            customRender: (value) => formatDate(value),
        },
        { key: "total_jours", label: "Total jours" },
        { key: "volume_total_m3", label: "Volume Total (m³)" },
        { key: "co2_total_kg", label: "CO2 évité (kg)" },
        {
            key: "date_fin",
            label: "Date de fin",
            customRender: (value) => formatDate(value),
        },
    ];

    const fetchData = async () => {
        setIsLoading(true);
        const res = await fetch(`/api/installations/calcul-tous`);
        const { data } = await res.json();
        setData(data);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const onFiltredData = (value) => {
        setSearch(value);
        setCurrentPage(1);
        if (value.trim() === "") {
            fetchData();
        } else {
            const filtered = data.filter(
                (item) =>
                    item.code_installation
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    item.maraicher
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    item.date_installation
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    item.date_fin.toLowerCase().includes(value.toLowerCase()),
            );
            setData(filtered);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pompage" />
            <HeaderPage
                title="Tableau de bord du pompage"
                onSearch={onFiltredData}
                search={search}
                btn={false}
            />

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    {data.length > 0 ? (
                        <DataTable
                            headers={headers}
                            rows={data}
                            itemsPerPage={itemsPerPage}
                            className="mt-4"
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(n) => setItemsPerPage(n)}
                        />
                    ) : (
                        <EmptyState nom="installation" search={search} />
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default PompagePage;
