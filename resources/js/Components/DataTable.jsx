import { usePage } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';

export default function DataTable({
    headers,
    rows,
    className = '',
    itemsPerPage = 5,
    actions = [],
    currentPage = 1,
    onPageChange = () => { },
    masqueColumns = [],
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const user = usePage().props.auth.user;

    // Fonction pour gérer le tri
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Tri des données
    const sortedRows = useMemo(() => {
        if (!sortConfig.key) return rows;

        return [...rows].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Gestion des valeurs null/undefined
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Tri numérique si les valeurs sont des nombres
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Tri par date si les valeurs ressemblent à des dates
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            if (!isNaN(aDate) && !isNaN(bDate) && aValue.toString().includes('-')) {
                return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
            }

            // Tri alphabétique par défaut
            const aString = aValue.toString().toLowerCase();
            const bString = bValue.toString().toLowerCase();

            if (aString < bString) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aString > bString) {
                return sortConfig.direction === 'asc' ? 1 : -1;
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

    // Icône de tri
    const getSortIcon = (headerKey) => {
        if (sortConfig.key !== headerKey) {
            return (
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            );
        }

        if (sortConfig.direction === 'asc') {
            return (
                <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                            {headers.map((header, index) => (
                                !masqueColumns.includes(header.key) && (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer select-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => handleSort(header.key)}
                                    >
                                        <div className="flex items-center">
                                            {header.label}
                                            {getSortIcon(header.key)}
                                        </div>
                                    </th>
                                )
                            ))}
                            {actions.length > 0 && user.user_role?.name !== 'partenaire' && (
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                                {headers.map((header, cellIndex) => (
                                    !masqueColumns.includes(header.key) && (
                                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                                            {header.customRender ? header.customRender(row[header.key], row) : row[header.key]}
                                        </td>
                                    )
                                ))}
                                {actions.length > 0 && user.user_role?.name !== 'partenaire' && (
                                    <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap dark:text-gray-200">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {actions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => action.handler(row)}
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

            <div className="flex flex-col items-center justify-between mt-4 space-y-2 sm:flex-row sm:space-y-0">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} sur {totalPages}
                </div>
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
    );
}
