import React from "react";
import { HiUser } from "react-icons/hi2";
import { FaSolarPanel, FaCalendarAlt } from "react-icons/fa";
import moment from "moment";

const ClientHeader = ({ client, installation }) => {
    const latestInstallation =
        installation && installation.length > 0 ? installation[0] : null;

    return (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 md:items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10">
                        <HiUser className="w-8 h-8 text-teal-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {client.nom} {client.prenom}
                        </h2>
                        <div className="flex items-center mt-1 space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Client ID: #{client.id}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                •
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Inscrit le{" "}
                                {moment(client.created_at).format(
                                    "DD MMM YYYY"
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {latestInstallation && (
                    <div
                        className={`flex items-center px-4 py-3 space-x-3 rounded-lg text-white border-2 ${
                            latestInstallation.statuts === "installée"
                                ? "border-green-500"
                                : "border-red-500"
                        }`}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-500/20">
                            <FaSolarPanel className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                Installation
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {latestInstallation.code_installation || "N/A"}
                            </p>
                            {latestInstallation.date_installation && (
                                <div className="flex items-center mt-1 space-x-1 text-xs text-gray-600 dark:text-gray-400">
                                    <FaCalendarAlt className="w-3 h-3" />
                                    <span>
                                        {moment(
                                            latestInstallation.date_installation
                                        ).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientHeader;
