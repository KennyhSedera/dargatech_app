import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getCount } from '@/Services/dasboardService';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { HiMiniUsers } from 'react-icons/hi2';
import { ImCogs } from 'react-icons/im';
import { IoBuild } from 'react-icons/io5';
import { GrMoney } from "react-icons/gr";

export default function Dashboard() {
    const [data, setData] = useState({});

    const getDataDB = async () => {
        const { data } = await getCount();
        setData(data);
    }

    useEffect(() => {
        getDataDB();
    }, []);

    const stats = [
        { label: 'Clients', value: data?.client ?? 0, color: 'from-orange-400 dark:to-orange-800 to-orange-600', icon: <HiMiniUsers /> },
        { label: 'Installations', value: data?.installation ?? 0, color: 'from-red-400 dark:to-red-800 to-orange-600', icon: <IoBuild /> },
        { label: 'Maintenances', value: data?.maintenance ?? 0, color: 'from-blue-400 dark:to-blue-800 to-orange-600', icon: <ImCogs /> },
        { label: 'Total Solde', value: `${data?.soldtotal ?? 0} €`, color: 'from-green-400 dark:to-green-800 to-orange-600', icon: <GrMoney /> },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Tableau de bord" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`group relative cursor-pointer bg-gradient-to-tr ${stat.color} text-white rounded-xl shadow-lg p-6 flex items-center justify-between overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl z-10`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-medium">{stat.label}</h3>
                            <p className="text-3xl font-extrabold">{stat.value}</p>
                        </div>

                        <div className="opacity-40 text-6xl relative z-10 transform group-hover:rotate-12 transition-transform duration-300">
                            {stat.icon}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    </div>

                ))}
            </div>
        </AuthenticatedLayout>
    );
}
