import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getCount } from '@/Services/dasboardService';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { HiMiniUsers } from 'react-icons/hi2';
import { ImCogs } from 'react-icons/im';
import { IoBuild } from 'react-icons/io5';
import { GrMoney } from "react-icons/gr";
import BarChart from '@/Components/charts/BarChart';
import CircleChart from '@/Components/charts/CircleChart';
import AreaChart from '@/Components/charts/AreaChart';
import RapportQuotidient from '@/Components/dashboard/RapportQuotidient';
import moment from 'moment';
import "moment/locale/fr";
import { GeolocationTogoComponent } from '@/Components/GeolocationTogoComponent';

export default function Dashboard() {
    const [data, setData] = useState({});

    const getDataDB = async () => {
        const { data } = await getCount();
        setData(data);
    }

    useEffect(() => {
        getDataDB();
    }, []);

    const alertcount = data?.alertcount ?? [];
    const installationcount = data?.installationcount ?? [];
    const interventioncount = data?.interventioncount ?? [];

    const allDatesFormated = [
        ...new Set([...alertcount, ...installationcount, ...interventioncount].map(d => d.date))
    ]
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => moment(date).format("DD MMM"));

    const allDates = [
        ...new Set([...alertcount, ...installationcount, ...interventioncount].map((d) => d.date)),
    ].sort();

    const transformData = (data) =>
        allDates.map((date) => {
            const entry = data.find((d) => d.date === date);
            return entry ? entry.total : 0;
        });



    const series = [
        { name: "Installations", data: transformData(installationcount) },
        { name: "Alertes", data: transformData(alertcount) },
        { name: "Interventions", data: transformData(interventioncount) },
    ];

    const categories = allDatesFormated;

    const percentenpanne = data?.installation > 0
        ? parseFloat(((data?.enpanne * 100) / data?.installation).toFixed(2))
        : 0;

    const transformDataArea = (data) =>
        allDates.map((date) => {
            const entry = data.find((d) => d.date === date);
            return entry ? { x: moment(date).format("DD MMM"), y: entry.total } : { x: moment(date).format("DD MMM"), y: 0 };
        });
    const inst = transformDataArea(installationcount);

    const stats = [
        { label: 'Maraîchers', value: data?.client ?? 0, color: 'from-orange-400 dark:to-orange-800 to-orange-600', icon: <HiMiniUsers />, route: 'clients' },
        { label: 'Installations', value: data?.installation ?? 0, color: 'from-red-400 dark:to-red-800 to-orange-600', icon: <IoBuild />, route: 'installations' },
        { label: 'Maintenances', value: data?.maintenance ?? 0, color: 'from-blue-400 dark:to-blue-800 to-orange-600', icon: <ImCogs />, route: 'interventions' },
        { label: 'Total Solde', value: `${data?.soldtotal ?? 0} CFA`, color: 'from-green-400 dark:to-green-800 to-orange-600', icon: <GrMoney />, route: 'paiements' },
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
                            <h3 className="text-lg font-medium">{stat.label}</h3>
                            <p className="text-3xl font-extrabold">{stat.value}</p>
                        </div>

                        <div className="relative z-10 text-6xl transition-transform duration-300 transform opacity-40 group-hover:rotate-12">
                            {stat.icon}
                        </div>

                        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-tr group-hover:opacity-30"></div>
                    </Link>
                ))}
            </div>
            <div className='grid grid-cols-1 gap-2 mt-2 md:grid-cols-3'>
                <BarChart
                    className="col-span-2"
                    categories={categories}
                    series={series}
                    yaxistitle='Nombre total'
                    title='Mouvement dans 7 derniers jour'
                />
                <RapportQuotidient data={data} />
            </div>
            <div className='grid grid-cols-1 gap-2 mt-2 md:grid-cols-3'>
                <CircleChart
                    value={percentenpanne || 0}
                    title="Installation en panne"
                />
                <AreaChart
                    name='Total'
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
