import useTheme from "@/hooks/useTheme";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
    FaArrowLeft,
    FaUser,
    FaCheck,
    FaTools,
    FaListAlt,
    FaCalendarAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { IoWarning, IoSunny } from "react-icons/io5";
import DangerButton from "@/Components/buttons/DangerButton";
import { logo } from "@/constant";
import RapportPdf from "./RapportPdf";
import { FaDownload } from "react-icons/fa6";
import { Camera } from "lucide-react";
import ShowImage from "@/Components/ShowImage";

const RapportMaintenance = ({ intervention_id }) => {
    const { theme, setTheme } = useTheme();
    const [rapport, setRapport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("information");
    const [isPrinting, setIsPrinting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const contentRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const photoRapports = rapport ? JSON.parse(rapport?.photo_probleme) : [];

    useEffect(() => {
        setTheme(theme || "light");
    }, [theme]);

    useEffect(() => {
        const fetchRapport = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/api/rapport/maintenance/${intervention_id}`
                );
                setRapport(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Une erreur est survenue"
                );
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        };

        if (intervention_id) {
            fetchRapport();
        }
    }, [intervention_id]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Non spécifié";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                    <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">
                        Chargement du rapport...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="max-w-md p-8 bg-white shadow-xl dark:bg-slate-800 rounded-xl">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-full dark:bg-red-900/30">
                            <IoWarning className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Erreur
                        </h2>
                        <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                            {error}
                        </p>
                        <DangerButton
                            onClick={() => window.history.back()}
                            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            Retour
                        </DangerButton>
                    </div>
                </div>
            </div>
        );
    }

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === id
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-l-4 border-teal-500"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40"
            }`}
        >
            <span className="mr-3">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Head title="Rapport de maintenance - Dargatech" />

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Fixed Header */}
                    <div
                        className={`fixed top-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 ${
                            isPrinting ? "print-header" : ""
                        }`}
                    >
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div
                                className={`py-4 flex flex-col md:flex-row md:items-center md:justify-between ${
                                    isPrinting ? "print-header" : ""
                                }`}
                            >
                                <div className="flex items-center mb-4 md:mb-0">
                                    {/* Mobile menu button */}
                                    <button
                                        onClick={() =>
                                            setIsSidebarOpen(!isSidebarOpen)
                                        }
                                        className="p-2 mr-4 transition-shadow bg-white rounded-full shadow-sm dark:bg-slate-800 hover:shadow-md md:hidden"
                                    >
                                        <FaBars className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                    </button>

                                    <button
                                        onClick={() => window.history.back()}
                                        className="p-2 mr-4 transition-shadow bg-white rounded-full shadow-sm dark:bg-slate-800 hover:shadow-md no-print"
                                    >
                                        <FaArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                    </button>

                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center mr-3 rounded-full h-14 w-14">
                                            <img
                                                src={logo}
                                                alt="logo"
                                                className={`w-16 ${
                                                    isPrinting
                                                        ? "print-logo"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <h1
                                                className={`text-2xl font-bold ${
                                                    isPrinting
                                                        ? "print-title"
                                                        : ""
                                                }`}
                                            >
                                                Dargatech
                                            </h1>
                                            <p
                                                className={`text-sm text-slate-500 dark:text-slate-400 ${
                                                    isPrinting
                                                        ? "print-subtitle"
                                                        : ""
                                                }`}
                                            >
                                                Solutions solaires durables
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Maintenance #{rapport?.maintenanceId}
                                    </div>
                                    <div className="mt-1 text-lg font-semibold">
                                        Rapport d'intervention #{rapport?.id}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(rapport?.date_intervention)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Container */}
                    <div className="flex flex-1 pt-24 md:pt-32">
                        {/* Desktop Sidebar - Fixed */}
                        <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:left-0 md:top-24 md:bottom-0 md:bg-white md:dark:bg-slate-800 md:border-r md:border-slate-200 md:dark:border-slate-700 no-print">
                            <div className="flex-1 px-4 py-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <TabButton
                                        id="information"
                                        label="Information client"
                                        icon={<FaUser className="w-4 h-4" />}
                                    />
                                    <TabButton
                                        id="probleme"
                                        label="Problème"
                                        icon={<IoWarning className="w-4 h-4" />}
                                    />
                                    <TabButton
                                        id="diagnostic"
                                        label="Diagnostic"
                                        icon={<FaListAlt className="w-4 h-4" />}
                                    />
                                    <TabButton
                                        id="intervention"
                                        label="Intervention"
                                        icon={<FaTools className="w-4 h-4" />}
                                    />
                                    <TabButton
                                        id="verification"
                                        label="Vérification"
                                        icon={<FaCheck className="w-4 h-4" />}
                                    />
                                    <TabButton
                                        id="recommandation"
                                        label="Recommandations"
                                        icon={
                                            <FaCalendarAlt className="w-4 h-4" />
                                        }
                                    />
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={handleDownloadPdf}
                                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-colors bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700"
                                >
                                    <FaDownload className="w-4 h-4" />
                                    <span>Télécharger en PDF</span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Drawer Overlay */}
                        {isSidebarOpen && (
                            <div className="fixed inset-0 z-40 md:hidden">
                                <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={() => setIsSidebarOpen(false)}
                                ></div>
                                <div className="relative flex flex-col h-full bg-white shadow-xl w-80 dark:bg-slate-800">
                                    {/* Drawer Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold">
                                            Navigation
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setIsSidebarOpen(false)
                                            }
                                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            <FaTimes className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Drawer Content */}
                                    <div className="flex-1 px-4 py-6 overflow-y-auto">
                                        <div className="space-y-2">
                                            <TabButton
                                                id="information"
                                                label="Information client"
                                                icon={
                                                    <FaUser className="w-4 h-4" />
                                                }
                                            />
                                            <TabButton
                                                id="probleme"
                                                label="Problème"
                                                icon={
                                                    <IoWarning className="w-4 h-4" />
                                                }
                                            />
                                            <TabButton
                                                id="diagnostic"
                                                label="Diagnostic"
                                                icon={
                                                    <FaListAlt className="w-4 h-4" />
                                                }
                                            />
                                            <TabButton
                                                id="intervention"
                                                label="Intervention"
                                                icon={
                                                    <FaTools className="w-4 h-4" />
                                                }
                                            />
                                            <TabButton
                                                id="verification"
                                                label="Vérification"
                                                icon={
                                                    <FaCheck className="w-4 h-4" />
                                                }
                                            />
                                            <TabButton
                                                id="recommandation"
                                                label="Recommandations"
                                                icon={
                                                    <FaCalendarAlt className="w-4 h-4" />
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={handleDownloadPdf}
                                            className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-colors bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700"
                                        >
                                            <FaDownload className="w-4 h-4" />
                                            <span>Télécharger en PDF</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content Area - Scrollable */}
                        <div
                            className={`flex-1 md:ml-64 bg-gray-50 dark:bg-slate-900 ${
                                isPrinting ? "print-content" : ""
                            }`}
                        >
                            <div className="h-full overflow-y-auto ">
                                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                    {/* Content */}
                                    <div
                                        className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden ${
                                            isPrinting ? "print-content" : ""
                                        }`}
                                    >
                                        {/* Information Client */}
                                        {activeTab === "information" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <FaUser className="w-5 h-5 mr-3 text-teal-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Information du client
                                                    </h2>
                                                </div>

                                                <div
                                                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                                                        isPrinting
                                                            ? "print-grid"
                                                            : ""
                                                    }`}
                                                >
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Nom complet
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {
                                                                rapport?.client
                                                                    ?.nom
                                                            }{" "}
                                                            {
                                                                rapport?.client
                                                                    ?.prenom
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Téléphone
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {
                                                                rapport?.client
                                                                    ?.telephone
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Localisation
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {
                                                                rapport?.client
                                                                    ?.localisation
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Email
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {rapport?.client
                                                                ?.email ||
                                                                "Non spécifié"}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Technicien
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {rapport?.user
                                                                ? `${rapport.user.name}`
                                                                : "Non assigné"}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                            isPrinting
                                                                ? "print-card"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${
                                                                isPrinting
                                                                    ? "print-card-title"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Date de
                                                            l'intervention
                                                        </div>
                                                        <div
                                                            className={`font-medium ${
                                                                isPrinting
                                                                    ? "print-card-content"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {formatDate(
                                                                rapport?.date_intervention
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Problème */}
                                        {activeTab === "probleme" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <IoWarning className="w-5 h-5 mr-3 text-red-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Description de la panne
                                                    </h2>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-medium">
                                                            Problèmes rapportés
                                                        </h3>
                                                        <div
                                                            className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-teal-500 ${
                                                                isPrinting
                                                                    ? "print-card"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {rapport?.description_panne ||
                                                                "Non spécifié"}
                                                        </div>
                                                    </div>

                                                    {rapport?.photo_probleme
                                                        ?.length > 0 && (
                                                        <div>
                                                            <h3 className="mb-3 text-lg font-medium">
                                                                Documentation
                                                                visuelle
                                                            </h3>
                                                            <div
                                                                className={`grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4 justify-center bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 ${
                                                                    isPrinting
                                                                        ? "print-card"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {photoRapports.length >
                                                                0 ? (
                                                                    photoRapports.map(
                                                                        (
                                                                            path,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                className="relative cursor-pointer group"
                                                                                onClick={() =>
                                                                                    setSelectedImage(
                                                                                        path
                                                                                    )
                                                                                }
                                                                            >
                                                                                <img
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    src={`/${path}`}
                                                                                    alt={`Photo du problème ${
                                                                                        index +
                                                                                        1
                                                                                    }`}
                                                                                    className="object-cover w-full h-auto transition duration-300 ease-in-out rounded-lg shadow-md group-hover:scale-105 md:h-56"
                                                                                />
                                                                                <div className="absolute top-0 flex items-center justify-center w-full h-full transition duration-300 ease-in-out rounded-lg opacity-0 group-hover:scale-105 md:h-56 bg-black/50 group-hover:opacity-100">
                                                                                    <Camera className="w-10 h-10 text-white transition opacity-0 group-hover:opacity-100" />
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <div>
                                                                        <h3 className="mb-3 text-lg font-medium">
                                                                            Documentation
                                                                            visuelle
                                                                        </h3>
                                                                        <div
                                                                            className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 flex items-center`}
                                                                        >
                                                                            <Camera className="mr-2 w-7 h-7" />
                                                                            Pas
                                                                            de
                                                                            documentation
                                                                            visuelle
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Diagnostic */}
                                        {activeTab === "diagnostic" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <FaListAlt className="w-5 h-5 mr-3 text-amber-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Diagnostic & Cause
                                                    </h2>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-medium">
                                                            Diagnostic initial
                                                        </h3>
                                                        <div
                                                            className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-amber-500 ${
                                                                isPrinting
                                                                    ? "print-card"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {rapport?.diagnostic_initial ||
                                                                "Non documenté"}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="mb-3 text-lg font-medium">
                                                            Cause identifiée
                                                        </h3>
                                                        <div
                                                            className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-orange-500 ${
                                                                isPrinting
                                                                    ? "print-card"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {rapport?.cause_identifiee ||
                                                                "Non identifiée"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Intervention */}
                                        {activeTab === "intervention" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <FaTools className="w-5 h-5 mr-3 text-green-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Interventions réalisées
                                                    </h2>
                                                </div>

                                                <div className="mb-3">
                                                    <span className="px-3 py-1 text-xs font-semibold text-green-800 uppercase bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-300">
                                                        {rapport?.maintenance
                                                            ?.type_intervention ||
                                                            "Non spécifié"}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-green-500 ${
                                                        isPrinting
                                                            ? "print-card"
                                                            : ""
                                                    }`}
                                                >
                                                    {rapport?.intervention_realisee ||
                                                        "Aucune intervention documentée"}
                                                </div>
                                            </div>
                                        )}

                                        {/* Vérification */}
                                        {activeTab === "verification" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <FaCheck className="w-5 h-5 mr-3 text-indigo-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Test post réparation
                                                    </h2>
                                                </div>

                                                <div className="mb-3">
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                                                            rapport?.maintenance
                                                                ?.status_intervention ===
                                                            "terminée"
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                                        }`}
                                                    >
                                                        {rapport?.maintenance
                                                            ?.status_intervention ||
                                                            "Non spécifié"}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-indigo-500 ${
                                                        isPrinting
                                                            ? "print-card"
                                                            : ""
                                                    }`}
                                                >
                                                    {rapport?.verification_fonctionnement ||
                                                        "Non documenté"}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommandations */}
                                        {activeTab === "recommandation" && (
                                            <div
                                                className={`p-6 ${
                                                    isPrinting
                                                        ? "print-section"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center mb-6">
                                                    <FaCalendarAlt className="w-5 h-5 mr-3 text-purple-500" />
                                                    <h2
                                                        className={`text-xl font-bold ${
                                                            isPrinting
                                                                ? "print-section-title"
                                                                : ""
                                                        }`}
                                                    >
                                                        Recommandations au
                                                        client
                                                    </h2>
                                                </div>

                                                <div
                                                    className={`bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 border-l-4 border-purple-500 ${
                                                        isPrinting
                                                            ? "print-card"
                                                            : ""
                                                    }`}
                                                >
                                                    {rapport?.recommandation_client ||
                                                        "Aucune recommandation spécifique"}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center ${
                                            isPrinting ? "print-footer" : ""
                                        }`}
                                    >
                                        <div>
                                            Rapport généré le{" "}
                                            {new Date().toLocaleDateString(
                                                "fr-FR"
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <span>
                                                Dargatech Solutions Solaires
                                            </span>
                                            <div className="w-1 h-1 mx-2 rounded-full bg-slate-400"></div>
                                            <span>
                                                Rapport #ID: {rapport?.id}
                                            </span>
                                            {isPrinting && (
                                                <span className="ml-4">
                                                    Page{" "}
                                                    <span className="print-page-number"></span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {selectedImage && photoRapports.includes(selectedImage) && (
                <ShowImage
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    listImages={photoRapports.length > 1 && photoRapports}
                />
            )}

            <div className="hidden">
                <RapportPdf data={rapport} ref={contentRef} />
            </div>
        </div>
    );
};

export default RapportMaintenance;
