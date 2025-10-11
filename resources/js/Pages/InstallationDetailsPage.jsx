import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

const Icons = {
    Calendar: () => <span className="text-lg">📅</span>,
    User: () => <span className="text-lg">👤</span>,
    MapPin: () => <span className="text-lg">📍</span>,
    Cog: () => <span className="text-lg">⚙️</span>,
    Wrench: () => <span className="text-lg">🔧</span>,
    Beaker: () => <span className="text-lg">🧪</span>,
    Bolt: () => <span className="text-lg">⚡</span>,
    Photo: () => <span className="text-lg">📸</span>,
    Phone: () => <span className="text-lg">📞</span>,
    Envelope: () => <span className="text-lg">✉️</span>,
    Id: () => <span className="text-lg">🆔</span>,
    Globe: () => <span className="text-lg">🌍</span>,
    Clock: () => <span className="text-lg">🕒</span>,
    Chart: () => <span className="text-lg">📊</span>,
    Sun: () => <span className="text-xl">☀️</span>,
    Moon: () => <span className="text-xl">🌙</span>,
};

const InstallationDetailsPage = ({ installation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (installation) {
            setLoading(false);
        }
    }, [installation]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case "installée":
                return "green-500";
            case "en_cours":
                return "yellow-500";
            case "planifiée":
                return "blue-500";
            case "en panne":
                return "red-500";
            default:
                return "gray-500 ";
        }
    };

    const photo = JSON.parse(installation?.photos_installation) || null;

    const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
        <div
            className={`bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-shadow duration-200 ${className}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <Icon />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-gray-100">
                        {value || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );

    const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:shadow-gray-900/30 transition-shadow duration-300 ${className}`}
        >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg dark:bg-gray-700">
                        <Icon />
                    </span>

                    <h2 className="text-xl font-bold dark:text-white">
                        {title}
                    </h2>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Chargement des données...
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={"Installation - " + installation.code_installation} />

            <div className="min-h-screen py-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="overflow-hidden bg-white border border-gray-100 shadow-xl dark:bg-gray-800 rounded-3xl dark:border-gray-700">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 text-2xl dark:bg-white/20 bg-gray-50 backdrop-blur-sm rounded-2xl">
                                                ⚙️
                                            </div>
                                            <div>
                                                <h1 className="text-4xl font-black dark:text-white">
                                                    Installation{" "}
                                                    {
                                                        installation.code_installation
                                                    }
                                                </h1>
                                                <p className="mt-2 text-lg font-medium text-blue-400 dark:text-blue-200">
                                                    Installée le{" "}
                                                    {formatDate(
                                                        installation.date_installation
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 transition-transform duration-200 transform hover:scale-105">
                                        <div
                                            className={`w-3 h-3 bg-${getStatusBadgeClass(
                                                installation.statuts
                                            )} rounded-xl`}
                                        ></div>
                                        <span
                                            className={`px-6 py-3 rounded-lg text-lg font-bold text-${getStatusBadgeClass(
                                                installation.statuts
                                            )} capitalize `}
                                        >
                                            {installation.statuts || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="py-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {installation.debit_nominal}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            m³/h Débit
                                        </div>
                                    </div>
                                    <div className="py-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {installation.hmt}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            m HMT
                                        </div>
                                    </div>
                                    <div className="py-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {installation.puissance_pompe}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            W Puissance
                                        </div>
                                    </div>
                                    <div className="py-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {installation.profondeur_forage}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            m Distance
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                        <SectionCard
                            title="Spécifications Techniques"
                            icon={Icons.Wrench}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoCard
                                    icon={Icons.Id}
                                    label="Code Installation"
                                    value={installation.code_installation}
                                />
                                <InfoCard
                                    icon={Icons.Beaker}
                                    label="N° de Série"
                                    value={installation.numero_serie}
                                />
                                <InfoCard
                                    icon={Icons.Globe}
                                    label="Source d'Eau"
                                    value={installation.source_eau}
                                />
                                <InfoCard
                                    icon={Icons.Chart}
                                    label="HMT"
                                    value={`${installation.hmt} m`}
                                />
                                <InfoCard
                                    icon={Icons.Bolt}
                                    label="Débit Nominal"
                                    value={`${installation.debit_nominal} m³/h`}
                                />
                                <InfoCard
                                    icon={Icons.Bolt}
                                    label="Puissance crête installé "
                                    value={`${installation.puissance_pompe} W`}
                                />
                            </div>
                            <div className="mt-4">
                                <InfoCard
                                    icon={Icons.Chart}
                                    label="Distance maximale pompe champ PV "
                                    value={`${installation.profondeur_forage} m`}
                                />
                            </div>
                            <div className="mt-4">
                                <InfoCard
                                    icon={Icons.Cog}
                                    label="Créée via"
                                    value={installation.created_via}
                                    className="capitalize"
                                />
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Informations Client"
                            icon={Icons.User}
                        >
                            <div className="space-y-4">
                                <div className="p-4 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl dark:border-blue-800">
                                    <div className="flex items-center gap-3">
                                        <Icons.User />
                                        <div>
                                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {installation.client?.prenom}{" "}
                                                {installation.client?.nom}
                                            </p>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                                Client Principal
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InfoCard
                                        icon={Icons.Id}
                                        label="CIN"
                                        value={installation.client?.CIN}
                                    />
                                    <InfoCard
                                        icon={Icons.User}
                                        label="Genre"
                                        value={installation.client?.genre}
                                    />
                                    <InfoCard
                                        icon={Icons.Phone}
                                        label="Téléphone"
                                        value={installation.client?.telephone}
                                    />
                                    <InfoCard
                                        icon={Icons.Envelope}
                                        label="Email"
                                        value={installation.client?.email}
                                    />
                                </div>

                                <InfoCard
                                    icon={Icons.MapPin}
                                    label="Localisation Client"
                                    value={installation.client?.localisation}
                                />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InfoCard
                                        icon={Icons.Chart}
                                        label="Type d'Activité"
                                        value={
                                            installation.client
                                                ?.type_activite_agricole
                                        }
                                    />
                                    <InfoCard
                                        icon={Icons.Chart}
                                        label="Surface Cultivée"
                                        value={`${installation.client?.surface_cultivee} ha`}
                                    />
                                </div>

                                <InfoCard
                                    icon={Icons.Calendar}
                                    label="Date de Contrat"
                                    value={formatDate(
                                        installation.client?.date_contrat
                                    )}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Géolocalisation"
                            icon={Icons.MapPin}
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InfoCard
                                        icon={Icons.Globe}
                                        label="Pays"
                                        value={installation.localisation?.pays}
                                    />
                                    <InfoCard
                                        icon={Icons.MapPin}
                                        label="Ville"
                                        value={installation.localisation?.ville}
                                    />
                                </div>

                                <div className="p-6 border border-green-100 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl dark:border-green-800">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        <Icons.MapPin />
                                        Coordonnées GPS
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="p-4 text-center bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {parseFloat(
                                                    installation.localisation
                                                        ?.latitude
                                                ).toFixed(8)}
                                                °
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                Latitude
                                            </div>
                                        </div>
                                        <div className="p-4 text-center bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {parseFloat(
                                                    installation.localisation
                                                        ?.longitude
                                                ).toFixed(8)}
                                                °
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                Longitude
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Historique & Photos"
                            icon={Icons.Photo}
                        >
                            <div className="space-y-6">
                                <div className="p-6 border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl dark:border-purple-800">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        <Icons.Clock />
                                        Timeline
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                Installée:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {formatDate(
                                                    installation.date_installation
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                Créée:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {formatDate(
                                                    installation.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                Mise à jour:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {formatDate(
                                                    installation.updated_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        <Icons.Photo />
                                        Photos de l'Installation
                                    </h3>

                                    {photo && photo.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                            {photo.map((photoUrl, index) => (
                                                <div
                                                    key={index}
                                                    className="relative overflow-hidden transition-shadow duration-300 shadow-lg group rounded-xl hover:shadow-xl dark:shadow-gray-900/50"
                                                >
                                                    <img
                                                        src={`/${photoUrl}`}
                                                        alt={`Photo ${
                                                            index + 1
                                                        }`}
                                                        className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/20 dark:bg-black/40 group-hover:opacity-100">
                                                        <span className="text-3xl">
                                                            📸
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center border-2 border-gray-200 border-dashed bg-gray-50 dark:bg-gray-700 rounded-xl dark:border-gray-600">
                                            <div className="mb-4 text-4xl">
                                                📸
                                            </div>
                                            <p className="font-medium text-gray-500 dark:text-gray-400">
                                                Aucune photo disponible
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                Les photos d'installation
                                                apparaîtront ici
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default InstallationDetailsPage;
