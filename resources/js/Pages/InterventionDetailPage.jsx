import React, { useEffect, useRef, useState } from "react";
import {
    Calendar,
    MapPin,
    User,
    Phone,
    Mail,
    Wrench,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    Droplet,
    Zap,
    Camera,
    Download,
    Info,
    Activity,
    TrendingUp,
    AlertTriangle,
    Shield,
    Settings,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import RapportPdf from "./rapport/RapportPdf";
import html2pdf from "html2pdf.js";
import { Head, usePage } from "@inertiajs/react";
import { addFavicon } from "@/constant";

const InterventionDetailPage = ({ data }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    if (!data) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-4xl p-12 mx-auto text-center bg-white shadow-2xl rounded-2xl dark:bg-gray-800">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-red-200 rounded-full opacity-50 blur-xl dark:bg-red-900"></div>
                        <AlertCircle className="relative w-20 h-20 mx-auto mb-6 text-red-500" />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">
                        Données non disponibles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Aucune donnée d'intervention disponible
                    </p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        addFavicon();
    }, []);

    const intervention = data;
    const installation = intervention.installation;
    const client = installation?.client;
    const rapport = intervention?.rapport_maintenance;
    const user = usePage().props.auth.user;
    const contentRef = useRef(null);

    const rapportDataPdf = {
        ...rapport,
        client: {
            id: client?.id,
            nom: client?.nom,
            prenom: client?.prenom,
            nom_complet: `${client?.nom} ${client?.prenom}`,
            telephone: client?.telephone,
            email: client?.email,
            localisation: client?.localisation,
            ville: client?.ville_acheteur,
            pays: client?.pays_acheteur,
            genre: client?.genre,
            cin: client?.CIN,
            date_contrat: client?.date_contrat,
            type_activite_agricole: client?.type_activite_agricole,
            surface_cultivee: client?.surface_cultivee,
        },
        user,
    };

    const parsePhotos = (photoString) => {
        try {
            return JSON.parse(photoString || "[]");
        } catch {
            return [];
        }
    };

    const handleDownloadPdf = () => {
        const element = contentRef.current;
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: `rapport-maintenance-${
                rapport?.id +
                    "-du-" +
                    rapport?.client?.nom +
                    "-" +
                    rapport?.client?.prenom || "undefined"
            }.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(element).set(opt).save();
    };

    const photosProbleme = parsePhotos(intervention.photo_probleme);
    const photosRapport = parsePhotos(rapport?.photo_probleme);
    const photosInstallation = parsePhotos(installation?.photos_installation);

    const allPhotos = [
        ...photosProbleme,
        ...photosRapport,
        ...photosInstallation,
    ];

    const getStatusConfig = (status) => {
        const configs = {
            terminée: {
                bg: "bg-gradient-to-r from-green-500 to-emerald-600",
                textBg: "bg-green-50 dark:bg-green-900/30",
                text: "text-green-700 dark:text-green-300",
                border: "border-green-200 dark:border-green-800",
                icon: CheckCircle,
                glow: "shadow-green-500/50",
            },
            en_cours: {
                bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
                textBg: "bg-blue-50 dark:bg-blue-900/30",
                text: "text-blue-700 dark:text-blue-300",
                border: "border-blue-200 dark:border-blue-800",
                icon: Clock,
                glow: "shadow-blue-500/50",
            },
            planifiée: {
                bg: "bg-gradient-to-r from-yellow-500 to-orange-600",
                textBg: "bg-yellow-50 dark:bg-yellow-900/30",
                text: "text-yellow-700 dark:text-yellow-300",
                border: "border-yellow-200 dark:border-yellow-800",
                icon: Calendar,
                glow: "shadow-yellow-500/50",
            },
        };
        return configs[status] || configs["en_cours"];
    };

    const statusConfig = getStatusConfig(intervention.status_intervention);
    const StatusIcon = statusConfig.icon;

    const getTypeConfig = (type) => {
        return type === "préventive"
            ? {
                  bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
                  text: "text-blue-50",
                  glow: "shadow-blue-500/50",
              }
            : {
                  bg: "bg-gradient-to-r from-red-500 to-pink-600",
                  text: "text-red-50",
                  glow: "shadow-red-500/50",
              };
    };

    const typeConfig = getTypeConfig(intervention.type_intervention);

    return (
        <AuthenticatedLayout>
            <Head title={"Intervention#" + intervention.id} />
            <div className="relative mx-6 mt-2 overflow-hidden bg-white rounded-2xl dark:bg-gray-800">
                <div className="relative px-6 py-12 mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold dark:text-white md:text-5xl">
                                    Intervention #{intervention.id}
                                </h1>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-full shadow-sm ${typeConfig.bg} ${typeConfig.glow}`}
                                >
                                    <Wrench className="w-4 h-4" />
                                    {intervention.type_intervention}
                                </div>
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-full shadow-sm ${statusConfig.bg} ${statusConfig.glow}`}
                                >
                                    <StatusIcon className="w-4 h-4" />
                                    {intervention.status_intervention}
                                </div>
                            </div>

                            <p className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
                                <Calendar className="w-5 h-5" />
                                {new Date(
                                    intervention.date_intervention
                                ).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {rapport && (
                                <button
                                    className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:shadow-xl hover:scale-105"
                                    onClick={handleDownloadPdf}
                                >
                                    <Download className="w-5 h-5" />
                                    Télécharger le rapport
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
                    <div className="relative p-6 overflow-hidden transition bg-white shadow-lg group rounded-2xl dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition bg-blue-100 rounded-full dark:bg-blue-900/30 group-hover:scale-150"></div>
                        <div className="relative">
                            <Activity className="w-8 h-8 mb-3 text-blue-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Installation
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {installation?.code_installation}
                            </p>
                        </div>
                    </div>

                    <div className="relative p-6 overflow-hidden transition bg-white shadow-lg group rounded-2xl dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition bg-yellow-100 rounded-full dark:bg-yellow-900/30 group-hover:scale-150"></div>
                        <div className="relative">
                            <Zap className="w-8 h-8 mb-3 text-yellow-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Puissance
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {installation?.puissance_pompe}W
                            </p>
                        </div>
                    </div>

                    <div className="relative p-6 overflow-hidden transition bg-white shadow-lg group rounded-2xl dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition bg-green-100 rounded-full dark:bg-green-900/30 group-hover:scale-150"></div>
                        <div className="relative">
                            <Droplet className="w-8 h-8 mb-3 text-green-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Débit
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {installation?.debit_nominal} L/h
                            </p>
                        </div>
                    </div>

                    <div className="relative p-6 overflow-hidden transition bg-white shadow-lg group rounded-2xl dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition bg-purple-100 rounded-full dark:bg-purple-900/30 group-hover:scale-150"></div>
                        <div className="relative">
                            <Camera className="w-8 h-8 mb-3 text-purple-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Photos
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {allPhotos.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <div className="flex gap-2 p-2 bg-white shadow-lg rounded-2xl dark:bg-gray-800">
                        {[
                            { id: "details", label: "Détails", icon: Info },
                            { id: "rapport", label: "Rapport", icon: FileText },
                            { id: "photos", label: "Photos", icon: Camera },
                            { id: "client", label: "Client", icon: User },
                        ].map((tab) => {
                            const TabIcon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                                        activeTab === tab.id
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <TabIcon className="w-5 h-5" />
                                    <span className="hidden md:inline">
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {activeTab === "details" && (
                            <>
                                <div className="p-8 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-red-100 rounded-xl dark:bg-red-900/30">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                Description du problème
                                            </h3>
                                            <div className="w-20 h-1 mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
                                        </div>
                                    </div>
                                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                        {intervention.description_probleme}
                                    </p>
                                </div>

                                <div className="p-8 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                                            <Settings className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                Informations techniques
                                            </h3>
                                            <div className="w-20 h-1 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                Profondeur
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {
                                                    installation?.profondeur_forage
                                                }
                                                m
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                Source
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {installation?.source_eau}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                HMT
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {installation?.hmt}m
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                Statut
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {installation?.statuts}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "rapport" &&
                            (rapport ? (
                                <div className="p-8 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                    <div className="flex items-start gap-4 mb-8">
                                        <div className="p-3 bg-green-100 rounded-xl dark:bg-green-900/30">
                                            <FileText className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                Rapport de maintenance
                                            </h3>
                                            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                label: "Diagnostic initial",
                                                value: rapport.diagnostic_initial,
                                                color: "blue",
                                            },
                                            {
                                                label: "Cause identifiée",
                                                value: rapport.cause_identifiee,
                                                color: "yellow",
                                            },
                                            {
                                                label: "Intervention réalisée",
                                                value: rapport.intervention_realisee,
                                                color: "purple",
                                            },
                                            {
                                                label: "Vérification",
                                                value: rapport.verification_fonctionnement,
                                                color: "green",
                                            },
                                            {
                                                label: "Recommandations",
                                                value: rapport.recommandation_client,
                                                color: "red",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className={`p-6 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-900/20 border-l-4 border-${item.color}-500`}
                                            >
                                                <p
                                                    className={`mb-2 text-sm font-bold uppercase tracking-wide text-${item.color}-700 dark:text-${item.color}-300`}
                                                >
                                                    {item.label}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-orange-200 rounded-full opacity-50 animate-pulse blur-xl dark:bg-orange-900"></div>
                                        <div className="relative p-6 bg-orange-100 rounded-full dark:bg-orange-900/30">
                                            <FileText className="w-16 h-16 text-orange-500 dark:text-orange-400" />
                                        </div>
                                    </div>

                                    <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                                        Rapport non disponible
                                    </h3>

                                    <p className="max-w-md mx-auto mb-6 text-gray-600 dark:text-gray-400">
                                        Aucun rapport de maintenance n'a encore
                                        été généré pour cette intervention. Le
                                        rapport sera disponible une fois
                                        l'intervention terminée.
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-orange-700 bg-orange-100 rounded-xl dark:bg-orange-900/30 dark:text-orange-300">
                                        <AlertCircle className="w-5 h-5" />
                                        En attente de rapport
                                    </div>

                                    <div className="flex items-center justify-center gap-3 mt-8">
                                        <div className="w-20 h-1 bg-orange-200 rounded-full dark:bg-orange-800"></div>
                                        <Clock className="w-5 h-5 text-orange-400" />
                                        <div className="w-20 h-1 bg-orange-200 rounded-full dark:bg-orange-800"></div>
                                    </div>

                                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                                        Le technicien doit compléter
                                        l'intervention pour générer le rapport
                                    </p>
                                </div>
                            ))}

                        {activeTab === "photos" && allPhotos.length > 0 && (
                            <div className="p-8 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900/30">
                                        <Camera className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                            Galerie photos ({allPhotos.length})
                                        </h3>
                                        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {allPhotos.map((photo, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(photo)
                                            }
                                            className="relative overflow-hidden transition bg-gray-200 cursor-pointer group rounded-2xl aspect-square dark:bg-gray-700 hover:shadow-2xl hover:scale-105"
                                        >
                                            <img
                                                src={`/${photo}`}
                                                alt={`Photo ${index + 1}`}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center transition bg-black bg-opacity-0 group-hover:bg-opacity-40">
                                                <Camera className="w-10 h-10 text-white transition opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "client" && (
                            <div className="p-8 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="p-3 bg-indigo-100 rounded-xl dark:bg-indigo-900/30">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                            Informations complètes du client
                                        </h3>
                                        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                Nom complet
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {client?.nom} {client?.prenom}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                                Genre
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {client?.genre}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            Contact
                                        </p>
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                                                <Phone className="w-4 h-4" />{" "}
                                                {client?.telephone}
                                            </p>
                                            <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                                                <Mail className="w-4 h-4" />{" "}
                                                {client?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            Activité agricole
                                        </p>
                                        <p className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                                            {client?.type_activite_agricole}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Surface: {client?.surface_cultivee}{" "}
                                            ha
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            Localisation
                                        </p>
                                        <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                                            <MapPin className="w-4 h-4" />{" "}
                                            {client?.localisation}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {client?.ville_acheteur},{" "}
                                            {client?.pays_acheteur}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline Card */}
                        <div className="p-6 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                            <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900 dark:text-white">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Chronologie
                            </h3>
                            <div className="space-y-4">
                                <div className="relative pl-8 before:absolute before:left-2 before:top-3 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:ring-4 before:ring-blue-100 dark:before:ring-blue-900">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Intervention
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {new Date(
                                            intervention.date_intervention
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div className="relative pl-8 before:absolute before:left-2 before:top-3 before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:ring-4 before:ring-green-100 dark:before:ring-green-900">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Installation
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {new Date(
                                            installation?.date_installation
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div className="relative pl-8 before:absolute before:left-2 before:top-3 before:w-2 before:h-2 before:bg-purple-500 before:rounded-full before:ring-4 before:ring-purple-100 dark:before:ring-purple-900">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Contrat client
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {new Date(
                                            client?.date_contrat
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div
                            className={`p-6 transition shadow-xl rounded-2xl ${statusConfig.textBg} border-2 ${statusConfig.border} hover:shadow-2xl`}
                        >
                            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                <Shield className="w-5 h-5" />
                                Statut actuel
                            </h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-700/50">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        État
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${statusConfig.text}`}
                                    >
                                        {intervention.status_intervention}
                                    </p>
                                </div>
                                <StatusIcon
                                    className={`w-12 h-12 ${statusConfig.text}`}
                                />
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <div className="p-6 transition shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl hover:shadow-2xl">
                            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                                <TrendingUp className="w-5 h-5" />
                                Résumé rapide
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <span className="text-sm text-white/90">
                                        Type
                                    </span>
                                    <span className="font-semibold text-white">
                                        {intervention.type_intervention}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <span className="text-sm text-white/90">
                                        Code install.
                                    </span>
                                    <span className="font-semibold text-white">
                                        {installation?.code_installation}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <span className="text-sm text-white/90">
                                        Client
                                    </span>
                                    <span className="font-semibold text-white">
                                        {client?.nom}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <span className="text-sm text-white/90">
                                        Photos
                                    </span>
                                    <span className="font-semibold text-white">
                                        {allPhotos.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="p-6 transition bg-white shadow-xl rounded-2xl dark:bg-gray-800 hover:shadow-2xl">
                            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                <User className="w-5 h-5 text-indigo-600" />
                                Contact client
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 transition rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Téléphone
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {client?.telephone}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 transition rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <Mail className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Email
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {client?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 transition rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <MapPin className="w-5 h-5 text-red-600" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Localisation
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {client?.localisation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-6xl max-h-full duration-300 animate-in zoom-in-95">
                        <img
                            src={`/${selectedImage}`}
                            alt="Photo agrandie"
                            className="object-contain max-w-full max-h-screen shadow-2xl rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute p-3 text-white transition rounded-full bg-white/10 backdrop-blur-md top-4 right-4 hover:bg-white/20 hover:scale-110"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="absolute px-6 py-3 text-sm text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-white/10 backdrop-blur-md">
                            Cliquez n'importe où pour fermer
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden">
                <RapportPdf data={rapportDataPdf} ref={contentRef} />
            </div>
        </AuthenticatedLayout>
    );
};

export default InterventionDetailPage;
