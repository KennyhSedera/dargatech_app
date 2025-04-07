import React from 'react';

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
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(rows.length / itemsPerPage);

    const paginate = (pageNumber) => {
        onPageChange(pageNumber);
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
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        {header.label}
                                    </th>
                                )
                            ))}
                            {actions.length > 0 && (
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
                                {actions.length > 0 && (
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
