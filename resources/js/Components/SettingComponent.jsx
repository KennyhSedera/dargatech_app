import React, { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Layout, Settings } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { usePage } from "@inertiajs/react";

const SettingComponent = ({ isDrawerExpanded, setIsDrawerExpanded }) => {
    const user = usePage().props.auth.user;

    const layouts = [
        {
            id: "compact",
            label: "Compact",
            cols: "grid-cols-5",
            left: 1,
            right: 4,
            expanded: false,
        },
        {
            id: "balanced",
            label: "Équilibré",
            cols: "grid-cols-5",
            left: 2,
            right: 3,
            expanded: true,
        },
    ];

    const themes = [
        { id: "light", label: "Clair", icon: Sun },
        { id: "dark", label: "Sombre", icon: Moon },
        { id: "system", label: "Système", icon: Monitor },
    ];

    const { theme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme]);

    const handleChangeTheme = (newTheme) => {
        setSelectedTheme(newTheme.id);
        setTimeout(() => {
            setTheme(newTheme.id);
        }, 800);
    };

    const [selectedLayout, setSelectedLayout] = useState(
        isDrawerExpanded ? "balanced" : "compact"
    );

    const saveDrawerState = (isExpanded) => {
        try {
            const stored = localStorage.getItem("drawerSettings");
            let settings = stored ? JSON.parse(stored) : [];

            const userIndex = settings.findIndex((s) => s.user === user.id);
            if (userIndex !== -1) {
                settings[userIndex].isExpanded = isExpanded;
            } else {
                settings.push({ user: user.id, isExpanded });
            }

            localStorage.setItem("drawerSettings", JSON.stringify(settings));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du menu :", error);
        }
    };

    const toggleDrawer = (layout) => {
        setSelectedLayout(layout.id);
        setTimeout(() => {
            setIsDrawerExpanded(layout.expanded);
            saveDrawerState(layout.expanded);
        }, 800);
    };

    return (
        <div className="w-full max-h-screen p-4 border-2 border-blue-500 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="flex items-center justify-between text-3xl font-bold text-gray-900 dark:text-white">
                        Paramètres
                        <Settings />
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Personnalisez votre expérience d'utilisation
                    </p>
                </div>

                {/* Section Layout */}
                <div className="p-4 space-y-4 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                            <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Affichage
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choisissez la disposition du menu latéral
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 px-4">
                        {layouts.map((layout) => (
                            <button
                                key={layout.id}
                                onClick={() => toggleDrawer(layout)}
                                className={`group relative transition-all duration-300 ${
                                    selectedLayout === layout.id
                                        ? "scale-105"
                                        : "hover:scale-102"
                                }`}
                            >
                                <div
                                    className={`grid ${
                                        layout.cols
                                    } rounded-xl w-28 h-20 overflow-hidden shadow-md transition-all duration-300 ${
                                        selectedLayout === layout.id
                                            ? "ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"
                                            : "ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600"
                                    }`}
                                >
                                    <div
                                        className={`bg-gradient-to-br from-blue-500 to-blue-600 col-span-${layout.left}`}
                                    ></div>
                                    <div
                                        className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 col-span-${layout.right}`}
                                    ></div>
                                </div>
                                <div className="mt-2 text-center">
                                    <span
                                        className={`text-sm font-medium ${
                                            selectedLayout === layout.id
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                    >
                                        {layout.label}
                                    </span>
                                </div>
                                {selectedLayout === layout.id && (
                                    <div className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full shadow-lg -top-2 -right-2">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Thème */}
                <div className="p-6 space-y-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                            <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Thème
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Sélectionnez votre thème préféré
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {themes.map((th) => {
                            const Icon = th.icon;
                            const isSelected = selectedTheme === th.id;
                            return (
                                <button
                                    key={th.id}
                                    onClick={() => handleChangeTheme(th)}
                                    className={`relative group p-2 rounded-xl transition-all duration-300 ${
                                        isSelected
                                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                                            : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-102"
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className={`p-3 rounded-full ${
                                                isSelected
                                                    ? "bg-white/20"
                                                    : "bg-white dark:bg-gray-800"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-6 h-6 ${
                                                    isSelected
                                                        ? "text-white"
                                                        : "text-gray-600 dark:text-gray-400"
                                                }`}
                                            />
                                        </div>
                                        <span className="font-medium">
                                            {th.label}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full shadow-lg -top-2 -right-2">
                                            <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingComponent;
