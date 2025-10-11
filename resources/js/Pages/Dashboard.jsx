import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getCount } from "@/Services/dasboardService";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { HiMiniUsers } from "react-icons/hi2";
import { ImCogs } from "react-icons/im";
import { IoBuild } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";
import BarChart from "@/Components/charts/BarChart";
import CircleChart from "@/Components/charts/CircleChart";
import AreaChart from "@/Components/charts/AreaChart";
import RapportQuotidient from "@/Components/dashboard/RapportQuotidient";
import moment from "moment";
import "moment/locale/fr";
import { GeolocationTogoComponent } from "@/Components/GeolocationTogoComponent";
import Calendar from "@/Components/Calendar";
import { getmaintenances } from "@/Services/maintenanceService";
import { all } from "axios";
import { getinstallations } from "@/Services/installationService";
import TableNew from "@/Components/dashboard/TableNew";
import { formatMontant } from "@/constant";

export default function Dashboard() {
    const [data, setData] = useState({});
    const [events, setEvents] = useState([]);
    const [percentenpanne, setPercentenpanne] = useState(0);
    const [new_installations, setNew_installations] = useState([]);
    const [new_maraichers, setNew_maraichers] = useState([]);

    const getDataDB = async () => {
        const { data } = await getCount();
        setData(data);
    };

    const getColor = (color) => {
        switch (color) {
            case "erreur":
                return "red-500";
            case "en panne":
                return "red-500";
            case "terminée":
                return "green-500";
            case "installée":
                return "green-500";
            default:
                return "blue-500";
        }
    };

    const getEvenement = async () => {
        const [installation, maintenance] = await all([
            getinstallations(),
            getmaintenances(),
        ]);

        const installationEvents = installation.data.map((d) => ({
            type: "installation",
            id: d.id,
            title: `Installation ${d.code_installation}`,
            date: d.date_installation,
            color: getColor(d.statuts),
            description: `Maraicher : ${d.client.nom} ${d.client.prenom}, Num série : ${d.numero_serie}, Puissance crête installée : ${d.puissance_pompe}W, Profondeur forage : ${d.profondeur_forage}m, Débit nominal : ${d.debit_nominal}m³/h, Source eau : ${d.source_eau}`,
            status: d.statuts,
        }));

        const maintenanceEvents = maintenance.data.map((d) => ({
            type: "maintenance",
            id: d.id,
            title: `Intervention ${d.type_intervention} (${d.installation.code_installation})`,
            date: d.date_intervention,
            color: getColor(d.status_intervention),
            status: d.status_intervention,
            description: d.description_probleme,
        }));

        const datas = [...installationEvents, ...maintenanceEvents];

        setEvents(datas);
    };

    useEffect(() => {
        getDataDB();
        getEvenement();
    }, []);

    const alertcount = data?.alertcount ?? [];
    const installationcount = data?.installationcount ?? [];
    const interventioncount = data?.interventioncount ?? [];

    const allDatesFormated = [
        ...new Set(
            [...alertcount, ...installationcount, ...interventioncount].map(
                (d) => d.date
            )
        ),
    ]
        .sort((a, b) => new Date(a) - new Date(b))
        .map((date) => moment(date).format("DD MMM"));

    const allDates = [
        ...new Set(
            [...alertcount, ...installationcount, ...interventioncount].map(
                (d) => d.date
            )
        ),
    ].sort();

    const transformData = (data) =>
        allDates.map((date) => {
            const entry = data.find((d) => d.date === date);
            return entry ? entry.total : 0;
        });

    const series = [
        { name: "Installations", data: transformData(installationcount) },
        { name: "Interventions", data: transformData(interventioncount) },
    ];

    const categories = allDatesFormated;

    useEffect(() => {
        setPercentenpanne(
            data?.installation > 0
                ? parseFloat(
                      ((data?.enpanne * 100) / data?.installation).toFixed(2)
                  )
                : 0
        );
        newData(data);
    }, [data]);

    const newData = (data) => {
        const new_maraicher = data?.new_maraicher?.map((d) => ({
            id: d.id,
            name: d.nom + " " + d.prenom,
            statuts: d.is_payed ? "Payé" : "Non payé",
            color: d.is_payed ? "bg-green-500" : "bg-red-500",
            date: d.date,
        }));

        console.log(data);

        const new_installation = data?.new_installation?.map((d) => ({
            id: d.code_installation,
            name: d.client_nom + " " + d.client_prenom,
            statuts: d.statuts,
            color: d.statuts === "en panne" ? "bg-red-500" : "bg-green-500",
            date: d.date,
        }));
        setNew_maraichers(new_maraicher);
        setNew_installations(new_installation);
    };

    const transformDataArea = (data) =>
        allDates.map((date) => {
            const entry = data.find((d) => d.date === date);
            return entry
                ? { x: moment(date).format("DD MMM"), y: entry.total }
                : { x: moment(date).format("DD MMM"), y: 0 };
        });
    const inst = transformDataArea(installationcount);

    const stats = [
        {
            label: "Maraîchers",
            value: data?.client ?? 0,
            color: "from-orange-400 dark:to-orange-800 to-orange-600",
            icon: <HiMiniUsers />,
            route: "clients",
        },
        {
            label: "Installations",
            value: data?.installation ?? 0,
            color: "from-red-400 dark:to-red-800 to-orange-600",
            icon: <IoBuild />,
            route: "installations",
        },
        {
            label: "Maintenances",
            value: data?.maintenance ?? 0,
            color: "from-blue-400 dark:to-blue-800 to-orange-600",
            icon: <ImCogs />,
            route: "interventions",
        },
        {
            label: "Total Solde",
            value: `${formatMontant(data?.soldtotal ?? 0)} CFA`,
            color: "from-green-400 dark:to-green-800 to-orange-600",
            icon: <GrMoney />,
            route: "paiements",
        },
    ];

    const chartOptions = {
        xaxis: {
            type: "category",
            labels: { style: { colors: "#22c55e", fontSize: "12px" } },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tableau de bord" />
            <div className="grid grid-cols-1 gap-4 p-4 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.route}
                        className={`group relative cursor-pointer bg-gradient-to-tr ${stat.color} text-white rounded-xl shadow-lg p-6 flex items-center justify-between overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl z-10`}
                    >
                        <div className="absolute inset-0 transition-opacity duration-1000 opacity-0 bg-gradient-to-bl group-hover:opacity-100"></div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-medium">
                                {stat.label}
                            </h3>
                            <p className="text-3xl font-extrabold">
                                {stat.value}
                            </p>
                        </div>

                        <div className="relative z-10 text-6xl transition-transform duration-300 transform opacity-40 group-hover:rotate-12">
                            {stat.icon}
                        </div>

                        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-tr group-hover:opacity-30"></div>
                    </Link>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {new_maraichers?.length > 0 && (
                    <div className="w-full h-full p-2 bg-white rounded-md shadow-md dark:bg-gray-800">
                        <TableNew title="Maraichers" data={new_maraichers} />
                    </div>
                )}
                {new_installations?.length > 0 && (
                    <div className="w-full h-full p-2 bg-white rounded-md shadow-md dark:bg-gray-800">
                        <TableNew
                            title="Installations"
                            data={new_installations}
                        />
                    </div>
                )}
            </div>
            <Calendar className="mt-2" events={events} />
            <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-3">
                <BarChart
                    className="col-span-2"
                    categories={categories}
                    series={series}
                    yaxistitle="Nombre total"
                    title="Mouvement dans 7 derniers jour"
                />
                <RapportQuotidient data={data} />
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-3">
                <CircleChart
                    value={percentenpanne || 0}
                    title="Installation en panne"
                />
                <AreaChart
                    name="Total"
                    seriesData={inst}
                    chartOptions={chartOptions}
                    title="Analyse des Mouvements de l'installation"
                    className="col-span-2"
                />
            </div>
            <GeolocationTogoComponent />
        </AuthenticatedLayout>
    );
}
