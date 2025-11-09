import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import { FaEye } from "react-icons/fa6";

export default function DataTable({
    headers,
    rows,
    className = "",
    actions = [],
    currentPage = 1,
    onPageChange = () => {},
    onItemsPerPageChange = () => {},
    masqueColumns = [],
    itemsPerPageOptions = [5, 8, 10, 25, 50, 100],
}) {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const user = usePage().props.auth.user;

    // Fonction pour récupérer le itemsPerPage de l'utilisateur actuel
    const getUserItemsPerPage = () => {
        try {
            const stored = localStorage.getItem("itemsPerPageSettings");
            if (stored) {
                const settings = JSON.parse(stored);
                const userSetting = settings.find((s) => s.user === user.id);
                return userSetting ? userSetting.nb : 10;
            }
        } catch (error) {
            console.error("Erreur lors de la lecture du localStorage:", error);
        }
        return 10;
    };

    const [itemsPerPage, setitemsPerPage] = useState(getUserItemsPerPage());

    // Fonction pour sauvegarder le itemsPerPage de l'utilisateur actuel
    const saveUserItemsPerPage = (nb) => {
        try {
            const stored = localStorage.getItem("itemsPerPageSettings");
            let settings = stored ? JSON.parse(stored) : [];

            // Trouver l'index de l'utilisateur actuel
            const userIndex = settings.findIndex((s) => s.user === user.id);

            if (userIndex !== -1) {
                // Mettre à jour l'entrée existante
                settings[userIndex].nb = nb;
            } else {
                // Ajouter une nouvelle entrée
                settings.push({ nb: nb, user: user.id });
            }

            localStorage.setItem(
                "itemsPerPageSettings",
                JSON.stringify(settings)
            );
        } catch (error) {
            console.error(
                "Erreur lors de la sauvegarde dans localStorage:",
                error
            );
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const isSortable = (header) => {
        return header.sortable === true;
    };

    const sortedRows = useMemo(() => {
        if (!sortConfig.key) return rows;

        return [...rows].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            if (
                !isNaN(aDate) &&
                !isNaN(bDate) &&
                aValue.toString().includes("-")
            ) {
                return sortConfig.direction === "asc"
                    ? aDate - bDate
                    : bDate - aDate;
            }

            const aString = aValue.toString().toLowerCase();
            const bString = bValue.toString().toLowerCase();

            if (aString < bString) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aString > bString) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [rows, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = sortedRows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedRows.length / itemsPerPage);

    const paginate = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        onItemsPerPageChange(newItemsPerPage);
        onPageChange(1);
        setitemsPerPage(newItemsPerPage);
        saveUserItemsPerPage(newItemsPerPage);
    };

    const getSortIcon = (headerKey) => {
        if (sortConfig.key !== headerKey) {
            return (
                <svg
                    className="w-4 h-4 ml-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                </svg>
            );
        }

        if (sortConfig.direction === "asc") {
            return (
                <svg
                    className="w-4 h-4 ml-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                    />
                </svg>
            );
        } else {
            return (
                <svg
                    className="w-4 h-4 ml-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            );
        }
    };

    return (
        <div>
            <div className={`overflow-auto rounded-lg shadow-sm ${className}`}>
                <table className="w-full min-w-full bg-white table-auto dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {headers.map(
                                (header, index) =>
                                    !masqueColumns.includes(header.key) && (
                                        <th
                                            key={index}
                                            className={`px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300 ${
                                                isSortable(header)
                                                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                                    : ""
                                            }`}
                                            onClick={
                                                isSortable(header)
                                                    ? () =>
                                                          handleSort(header.key)
                                                    : undefined
                                            }
                                        >
                                            <div className="flex items-center">
                                                {header.label}
                                                {isSortable(header) &&
                                                    getSortIcon(header.key)}
                                            </div>
                                        </th>
                                    )
                            )}
                            {actions.length > 0 && (
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentRows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {headers.map(
                                    (header, cellIndex) =>
                                        !masqueColumns.includes(header.key) && (
                                            <td
                                                key={cellIndex}
                                                className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200"
                                            >
                                                {header.customRender
                                                    ? header.customRender(
                                                          row[header.key],
                                                          row
                                                      )
                                                    : row[header.key]}
                                            </td>
                                        )
                                )}
                                {actions.length > 0 &&
                                    user.user_role?.name !== "partenaire" && (
                                        <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap dark:text-gray-200">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {actions.map(
                                                    (action, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                action.handler(
                                                                    row
                                                                )
                                                            }
                                                            className={`${action.color} rounded-md hover:${action.hoverColor} transition`}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    )}
                                {actions.length > 0 &&
                                    user.user_role?.name === "partenaire" && (
                                        <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap dark:text-gray-200">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {actions
                                                    .filter(
                                                        (action) =>
                                                            action.action ===
                                                            true
                                                    )
                                                    .map((action, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                action.handler(
                                                                    row
                                                                )
                                                            }
                                                            className={`${action.color} rounded-md hover:${action.hoverColor} transition`}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                            </div>
                                        </td>
                                    )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center justify-between mt-4 space-y-3 sm:flex-row sm:space-y-0">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} sur {totalPages} (éléments{" "}
                    {indexOfFirstItem + 1} à{" "}
                    {Math.min(indexOfLastItem, sortedRows.length)} sur{" "}
                    {sortedRows.length})
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="itemsPerPage"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Afficher :
                        </label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={(e) =>
                                handleItemsPerPageChange(Number(e.target.value))
                            }
                            className="w-16 px-2 py-1 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:text-gray-200"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option
                                    className="bg-gray-200 dark:bg-gray-800"
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Boutons de pagination */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
