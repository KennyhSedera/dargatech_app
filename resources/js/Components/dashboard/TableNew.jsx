import React from "react";
import moment from "moment";

const TableNew = ({
    header = ["ID", "Nom", "Statuts", "Date"],
    data,
    title,
}) => {
    return (
        <div>
            <div className="text-2xl font-semibold text-center">
                Nouveau {title}
            </div>
            <table className="w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                        {header.map((item, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
                            >
                                {item}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data?.map((item, index) => (
                        <tr
                            key={index}
                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                                {item.id}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                                {item.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                                <span
                                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${item.color}`}
                                >
                                    {item.statuts}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                                {moment(item.date).format("DD/MM/YYYY")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableNew;
