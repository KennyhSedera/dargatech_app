import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getClient } from "@/Services/clientService";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
    HiMiniDevicePhoneMobile,
    HiOutlineMapPin,
    HiIdentification,
} from "react-icons/hi2";
import { LuTrees } from "react-icons/lu";
import { FaRulerCombined, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import { IoMaleFemale } from "react-icons/io5";
import moment from "moment";
import "moment/locale/fr";
import PaiementsSection from "@/Components/clients/PaiementsSection";
import ClientInfoCard from "@/Components/clients/ClientInfoCard";
import EmptyState from "@/Components/EmptyState";
import LoadingSpinner from "@/Components/clients/LoadingSpinner";
import ClientHeader from "@/Components/clients/ClientHeader";

moment.locale("fr");

const ClientDetailPage = ({ client }) => {
    const [paiement, setPaiement] = useState([]);
    const [installation, setInstallation] = useState([]);
    const [clients, setClients] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const getDataDB = async (id) => {
        try {
            setIsLoading(true);
            const data = await getClient(id);
            if (data) {
                setInstallation(data.client?.installations || []);
                setPaiement(data.client?.paiement || []);
                setClients(data.client);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (client?.id) {
            getDataDB(client.id);
        }
    }, [client]);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <LoadingSpinner />
            </AuthenticatedLayout>
        );
    }

    if (!client) {
        return (
            <AuthenticatedLayout>
                <EmptyState message="Aucune donnée client disponible" />
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`${client.nom} ${client.prenom}`} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
                            <ClientHeader
                                client={client}
                                installation={installation}
                            />

                            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                                <div className="space-y-6">
                                    <ClientInfoCard
                                        icon={HiMiniDevicePhoneMobile}
                                        label="Téléphone"
                                        value={client.telephone}
                                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                                        iconColor="text-blue-600 dark:text-blue-400"
                                    />

                                    <ClientInfoCard
                                        icon={FaEnvelope}
                                        label="Email"
                                        value={client.email}
                                        bgColor="bg-indigo-50 dark:bg-indigo-900/20"
                                        iconColor="text-indigo-600 dark:text-indigo-400"
                                    />

                                    <ClientInfoCard
                                        icon={HiIdentification}
                                        label="CIN"
                                        value={client.CIN}
                                        bgColor="bg-yellow-50 dark:bg-yellow-900/20"
                                        iconColor="text-yellow-600 dark:text-yellow-400"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20">
                                            <HiOutlineMapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Localisation
                                            </p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {clients?.localisation ||
                                                    "Non renseigné"}
                                            </p>
                                            {clients?.localisation?.pays && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {clients.localisation.pays}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <ClientInfoCard
                                        icon={IoMaleFemale}
                                        label="Genre"
                                        value={client.genre}
                                        bgColor="bg-purple-50 dark:bg-purple-900/20"
                                        iconColor="text-purple-600 dark:text-purple-400"
                                    />

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                            <FaCalendarAlt className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Date du contrat
                                            </p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {moment(
                                                    client.date_contrat
                                                ).format("DD MMM YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <ClientInfoCard
                                        icon={FaRulerCombined}
                                        label="Surface cultivée"
                                        value={`${client.surface_cultivee} ha`}
                                        bgColor="bg-green-50 dark:bg-green-900/20"
                                        iconColor="text-green-600 dark:text-green-400"
                                    />

                                    <ClientInfoCard
                                        icon={LuTrees}
                                        label="Type d'activité agricole"
                                        value={client.type_activite_agricole}
                                        bgColor="bg-teal-50 dark:bg-teal-900/20"
                                        iconColor="text-teal-600 dark:text-teal-400"
                                    />

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-900/50">
                                            ⚙️
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Créée via
                                            </p>
                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                {client.created_via ||
                                                    "Non renseigné"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PaiementsSection
                            paiements={paiement}
                            client={client}
                        />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ClientDetailPage;
