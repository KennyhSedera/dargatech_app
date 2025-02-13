import React from 'react';

export default function DataTable({
    headers,
    rows,
    className = '',
    itemsPerPage = 10,
    actions = [],
    currentPage = 1, // Page courante passée depuis le parent
    onPageChange = () => { }, // Fonction pour changer la page
}) {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(rows.length / itemsPerPage);

    const paginate = (pageNumber) => {
        onPageChange(pageNumber); // Appeler la fonction pour mettre à jour la page courante
    };

    return (
        <div>
            <div className={`overflow-x-auto rounded-lg shadow-sm ${className}`}>
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                    {header}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentRows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {Object.keys(row).map((key, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="px-2 py-1 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                                    >
                                        {row[key]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className="flex space-x-2">
                                            {actions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => action.handler(row)}
                                                    className={`px-1 py-1 ${action.color} rounded-md hover:${action.hoverColor} transition`}
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

            <div className="flex justify-between items-center mt-4">
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
